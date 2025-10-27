"use strict";
// Kadro atama servisi - Deterministik algoritma
// Hedef Performans - Kadro Atama Sistemi
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateForBirthYear = getTemplateForBirthYear;
exports.getAgeGroupCode = getAgeGroupCode;
exports.listSquadsByAgeGroupAndTemplate = listSquadsByAgeGroupAndTemplate;
exports.findEmptySlot = findEmptySlot;
exports.createNewSquadInstance = createNewSquadInstance;
exports.assignUserToSlotTx = assignUserToSlotTx;
exports.autoAssignUser = autoAssignUser;
exports.getUserAssignment = getUserAssignment;
exports.getSquadOccupancy = getSquadOccupancy;
const client_1 = require("@prisma/client");
const positions_1 = require("./positions");
const prisma = new client_1.PrismaClient();
/**
 * Doğum yılına göre şablon seçimi
 */
function getTemplateForBirthYear(birthYear) {
    if (birthYear >= 2014 && birthYear <= 2018) {
        return '7+1';
    }
    else if (birthYear >= 2006 && birthYear <= 2013) {
        return '10+1';
    }
    throw new Error(`Desteklenmeyen doğum yılı: ${birthYear}`);
}
/**
 * Yaş grubu kodu oluşturma - U2012 formatında
 */
function getAgeGroupCode(birthYear) {
    return `U${birthYear}`;
}
/**
 * Yaş grubu ve şablona göre kadroları listele
 * Sıralama: Doluluk oranı en düşük → En eski (createdAt ASC) → Instance adı ASC
 */
async function listSquadsByAgeGroupAndTemplate(ageGroupCode, template) {
    const squads = await prisma.squad.findMany({
        where: {
            ageGroupCode,
            template
        },
        include: {
            assignments: true,
            _count: {
                select: { assignments: true }
            }
        },
        orderBy: [
            { createdAt: 'asc' }, // Önce en eski
            { instance: 'asc' } // Sonra instance adı
        ]
    });
    // Doluluk oranına göre manuel sıralama
    const totalSlots = (0, positions_1.getPositionsForTemplate)(template).length;
    return squads.sort((a, b) => {
        const aOccupancyRate = a._count.assignments / totalSlots;
        const bOccupancyRate = b._count.assignments / totalSlots;
        // 1. Doluluk oranı ASC (en az dolu önce)
        if (aOccupancyRate !== bOccupancyRate) {
            return aOccupancyRate - bOccupancyRate;
        }
        // 2. Eşit dolulukta createdAt ASC (en eski önce)
        if (a.createdAt.getTime() !== b.createdAt.getTime()) {
            return a.createdAt.getTime() - b.createdAt.getTime();
        }
        // 3. Eşit zamanda instance ASC
        return a.instance.localeCompare(b.instance);
    });
}
/**
 * Kadroda boş slot bulma
 */
function findEmptySlot(squad, positionKey) {
    const template = squad.template;
    const positions = (0, positions_1.getPositionsForTemplate)(template);
    const position = positions.find(p => p.positionKey === positionKey);
    if (!position)
        return null;
    // Bu pozisyonda atama var mı kontrol et
    const existingAssignment = squad.assignments.find((assignment) => assignment.positionKey === positionKey);
    return existingAssignment ? null : position.number;
}
/**
 * Yeni kadro instance oluşturma (A, B, C...)
 */
async function createNewSquadInstance(ageGroupCode, template) {
    // Mevcut instance'ları bul
    const existingSquads = await prisma.squad.findMany({
        where: { ageGroupCode, template },
        select: { instance: true }
    });
    // Sonraki instance harfini belirle
    const instances = existingSquads.map(s => s.instance).sort();
    let nextInstance = 'A';
    if (instances.length > 0) {
        const lastInstance = instances[instances.length - 1];
        nextInstance = String.fromCharCode(lastInstance.charCodeAt(0) + 1);
    }
    const name = `${ageGroupCode} ${template} ${nextInstance}`;
    const squad = await prisma.squad.create({
        data: {
            ageGroupCode,
            template,
            instance: nextInstance,
            name
        }
    });
    return squad;
}
/**
 * Kullanıcıyı slota atama (DB transaction)
 */
async function assignUserToSlotTx(params) {
    return await prisma.$transaction(async (tx) => {
        try {
            // Squad bilgisini al
            const squad = await tx.squad.findUnique({
                where: { id: params.squadId },
                select: { ageGroupCode: true }
            });
            if (!squad) {
                throw new Error('Squad bulunamadı');
            }
            const assignment = await tx.squadAssignment.create({
                data: {
                    squadId: params.squadId,
                    userId: params.userId,
                    ageGroupCode: squad.ageGroupCode,
                    positionKey: params.positionKey,
                    number: params.number,
                    source: params.source
                }
            });
            return assignment;
        }
        catch (error) {
            // Unique constraint ihlali - başka kadroya geç
            if (error.code === 'P2002') {
                throw new Error('SLOT_OCCUPIED');
            }
            throw error;
        }
    });
}
/**
 * Ana atama algoritması
 * 1. ANA mevki uygun slotu varsa ATA
 * 2. YEDEK mevki uygun slotu varsa ATA
 * 3. Yoksa yeni kadro oluştur → ANA slotuna ATA
 */
async function autoAssignUser(params) {
    const { userId, birthYear, mainPositionKey, altPositionKey } = params;
    // Template ve yaş grubu seç
    const template = getTemplateForBirthYear(birthYear);
    const ageGroupCode = getAgeGroupCode(birthYear);
    // DEBUG: Input bilgileri
    console.log(`[ASSIGN-DEBUG] Input: {userId: ${userId}, birthYear: ${birthYear}, mainPositionKey: ${mainPositionKey}, altPositionKey: ${altPositionKey}}`);
    console.log(`[ASSIGN-DEBUG] Computed: {ageGroupCode: ${ageGroupCode}, template: ${template}}`);
    // Idempotent kontrol: Kullanıcı zaten bu yaş grubunda atanmış mı?
    const existingAssignment = await prisma.squadAssignment.findFirst({
        where: {
            userId,
            ageGroupCode
        },
        include: {
            squad: true
        }
    });
    if (existingAssignment) {
        console.log(`[ASSIGN-DEBUG] Kullanıcı ${userId} zaten ${ageGroupCode} yaş grubunda atanmış`);
        return existingAssignment;
    }
    // Mevcut kadroları sırala
    const squads = await listSquadsByAgeGroupAndTemplate(ageGroupCode, template);
    // DEBUG: Squad listesi sıralandıktan sonra
    console.log(`[ASSIGN-DEBUG] Squad listesi (${squads.length} kadro):`);
    squads.forEach((squad, index) => {
        const filledCount = squad._count.assignments;
        const totalSlots = (0, positions_1.getPositionsForTemplate)(template).length;
        console.log(`[ASSIGN-DEBUG] ${index + 1}. ${squad.name} (${squad.instance}) - ${filledCount}/${totalSlots} slots - Created: ${squad.createdAt.toISOString()}`);
    });
    // Per-kadro slot arama stratejisi
    for (const squad of squads) {
        // DEBUG: Her kadro için slot durumu
        const mainAvailable = findEmptySlot(squad, mainPositionKey) !== null;
        const altAvailable = altPositionKey ? findEmptySlot(squad, altPositionKey) !== null : false;
        console.log(`[ASSIGN-DEBUG] ${squad.name}: main slot available? ${mainAvailable}, alt slot available? ${altAvailable}`);
        // 1. ANA mevki slotu ara (bu kadroda)
        const mainEmptySlot = findEmptySlot(squad, mainPositionKey);
        if (mainEmptySlot) {
            try {
                const assignment = await assignUserToSlotTx({
                    userId,
                    squadId: squad.id,
                    positionKey: mainPositionKey,
                    number: mainEmptySlot,
                    source: 'AUTO'
                });
                console.log(`[ASSIGN-DEBUG] REASON: 'MAIN' - ANA mevki ataması: ${userId} → ${squad.name} (${mainPositionKey})`);
                return assignment;
            }
            catch (error) {
                if (error.message === 'SLOT_OCCUPIED') {
                    continue; // Sonraki kadroya geç
                }
                throw error;
            }
        }
        // 2. YEDEK mevki slotu ara (aynı kadroda)
        if (altPositionKey) {
            const altEmptySlot = findEmptySlot(squad, altPositionKey);
            if (altEmptySlot) {
                try {
                    const assignment = await assignUserToSlotTx({
                        userId,
                        squadId: squad.id,
                        positionKey: altPositionKey,
                        number: altEmptySlot,
                        source: 'AUTO'
                    });
                    console.log(`[ASSIGN-DEBUG] REASON: 'ALT' - YEDEK mevki ataması: ${userId} → ${squad.name} (${altPositionKey})`);
                    return assignment;
                }
                catch (error) {
                    if (error.message === 'SLOT_OCCUPIED') {
                        continue; // Sonraki kadroya geç
                    }
                    throw error;
                }
            }
        }
    }
    // 3. Yeni kadro oluştur → ANA slotuna ATA
    console.log(`[ASSIGN-DEBUG] REASON: 'NEW_SQUAD' - Hiçbir kadroda slot bulunamadı, yeni kadro oluşturuluyor`);
    const newSquad = await createNewSquadInstance(ageGroupCode, template);
    const mainPositionNumber = (0, positions_1.getNumberForPosition)(template, mainPositionKey);
    if (!mainPositionNumber) {
        throw new Error(`Geçersiz pozisyon: ${mainPositionKey}`);
    }
    const assignment = await assignUserToSlotTx({
        userId,
        squadId: newSquad.id,
        positionKey: mainPositionKey,
        number: mainPositionNumber,
        source: 'AUTO'
    });
    console.log(`[ASSIGN-DEBUG] REASON: 'NEW_SQUAD' - Yeni kadro ataması: ${userId} → ${newSquad.name} (${mainPositionKey})`);
    return assignment;
}
/**
 * Kullanıcının mevcut atamasını getir
 */
async function getUserAssignment(userId) {
    return await prisma.squadAssignment.findFirst({
        where: { userId },
        include: {
            squad: true,
            user: {
                include: {
                    memberProfile: true
                }
            }
        }
    });
}
/**
 * Kadronun doluluk bilgilerini getir
 */
async function getSquadOccupancy(squadId) {
    const squad = await prisma.squad.findUnique({
        where: { id: squadId },
        include: {
            assignments: {
                include: {
                    user: {
                        include: {
                            memberProfile: true
                        }
                    }
                }
            }
        }
    });
    if (!squad)
        return null;
    const template = squad.template;
    const positions = (0, positions_1.getPositionsForTemplate)(template);
    const totalSlots = positions.length;
    const occupiedSlots = squad.assignments.length;
    const occupancyRate = (occupiedSlots / totalSlots) * 100;
    return {
        squad,
        totalSlots,
        occupiedSlots,
        occupancyRate,
        availableSlots: totalSlots - occupiedSlots
    };
}
