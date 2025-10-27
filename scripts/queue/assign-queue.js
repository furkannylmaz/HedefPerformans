"use strict";
// BullMQ Queue Sistemi - Kadro Atama
// Hedef Performans - Kadro Atama Sistemi
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueKey = getQueueKey;
exports.createAssignQueue = createAssignQueue;
exports.enqueueAssignJob = enqueueAssignJob;
exports.processAssignJob = processAssignJob;
exports.createAssignWorker = createAssignWorker;
exports.startAllWorkers = startAllWorkers;
exports.getQueueStatus = getQueueStatus;
exports.checkUserAssignmentStatus = checkUserAssignmentStatus;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const assign_1 = require("../squads/assign");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Redis bağlantısı
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
});
/**
 * Queue anahtarı oluşturma
 */
function getQueueKey(ageGroupCode, template) {
    return `assign:${ageGroupCode}:${template}`;
}
/**
 * Queue instance oluşturma
 */
function createAssignQueue(ageGroupCode, template) {
    const queueKey = getQueueKey(ageGroupCode, template);
    return new bullmq_1.Queue(queueKey, {
        connection,
        defaultJobOptions: {
            removeOnComplete: 100, // Son 100 job'u sakla
            removeOnFail: 50, // Son 50 failed job'u sakla
            attempts: 3, // 3 deneme hakkı
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        },
    });
}
/**
 * Job ekleme
 */
async function enqueueAssignJob(data) {
    const { birthYear } = data;
    // Yaş grubu ve şablon belirleme
    const ageGroupCode = `U${birthYear}`;
    const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1';
    const queue = createAssignQueue(ageGroupCode, template);
    try {
        await queue.add('assign-user', data, {
            jobId: `assign-${data.userId}-${Date.now()}`, // Unique job ID
        });
        console.log(`Atama job'u eklendi: ${data.userId} → ${ageGroupCode} ${template}`);
    }
    catch (error) {
        console.error('Job ekleme hatası:', error);
        throw error;
    }
    finally {
        await queue.close();
    }
}
/**
 * Worker processor - Job işleme
 */
async function processAssignJob(job) {
    const { userId, birthYear, mainPositionKey, altPositionKey } = job.data;
    console.log(`Atama job'u başlatıldı: ${userId}`);
    try {
        // Kullanıcı bilgilerini kontrol et
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                memberProfile: true
            }
        });
        if (!user) {
            throw new Error(`Kullanıcı bulunamadı: ${userId}`);
        }
        if (!user.memberProfile) {
            throw new Error(`Kullanıcı profili bulunamadı: ${userId}`);
        }
        if (user.status !== 'ACTIVE') {
            throw new Error(`Kullanıcı aktif değil: ${userId} (${user.status})`);
        }
        // Atama işlemini gerçekleştir
        const assignment = await (0, assign_1.autoAssignUser)({
            userId,
            birthYear,
            mainPositionKey,
            altPositionKey
        });
        console.log(`Atama job'u tamamlandı: ${userId} → ${assignment.id}`);
        return {
            success: true,
            assignmentId: assignment.id,
            squadId: assignment.squadId,
            positionKey: assignment.positionKey,
            number: assignment.number
        };
    }
    catch (error) {
        console.error(`Atama job'u hatası: ${userId}`, error.message);
        throw error;
    }
}
/**
 * Worker oluşturma ve başlatma
 */
function createAssignWorker(ageGroupCode, template) {
    const queueKey = getQueueKey(ageGroupCode, template);
    const worker = new bullmq_1.Worker(queueKey, processAssignJob, {
        connection,
        concurrency: 1, // Aynı anahtar için seri işlem
        limiter: {
            max: 10, // Dakikada max 10 job
            duration: 60000,
        },
    });
    // Event listeners
    worker.on('completed', (job, result) => {
        console.log(`✅ Job tamamlandı: ${job.id}`, result);
    });
    worker.on('failed', (job, err) => {
        console.error(`❌ Job başarısız: ${job?.id}`, err.message);
    });
    worker.on('error', (err) => {
        console.error(`🚨 Worker hatası:`, err);
    });
    return worker;
}
/**
 * Tüm yaş grupları için worker'ları başlat
 */
function startAllWorkers() {
    const workers = [];
    // Desteklenen yaş grupları ve şablonlar - U2012 formatında
    const ageGroups = ['U2006', 'U2007', 'U2008', 'U2009', 'U2010', 'U2011', 'U2012', 'U2013', 'U2014', 'U2015', 'U2016', 'U2017', 'U2018'];
    const templates = ['7+1', '10+1'];
    for (const ageGroup of ageGroups) {
        for (const template of templates) {
            const worker = createAssignWorker(ageGroup, template);
            workers.push(worker);
        }
    }
    console.log(`${workers.length} worker başlatıldı`);
    return workers;
}
/**
 * Queue durumunu kontrol et
 */
async function getQueueStatus(ageGroupCode, template) {
    const queue = createAssignQueue(ageGroupCode, template);
    try {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();
        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
            total: waiting.length + active.length + completed.length + failed.length
        };
    }
    finally {
        await queue.close();
    }
}
/**
 * Kullanıcının atama durumunu kontrol et
 */
async function checkUserAssignmentStatus(userId) {
    const assignment = await (0, assign_1.getUserAssignment)(userId);
    if (assignment) {
        return {
            status: 'ASSIGNED',
            assignment,
            squad: assignment.squad,
            position: assignment.positionKey,
            number: assignment.number
        };
    }
    return {
        status: 'PENDING',
        assignment: null
    };
}
