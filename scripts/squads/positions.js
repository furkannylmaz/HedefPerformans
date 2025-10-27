"use strict";
// Kadro pozisyonları ve forma numaraları
// Hedef Performans - Kadro Atama Sistemi
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_10_PLUS_1 = exports.TEMPLATE_7_PLUS_1 = void 0;
exports.getTemplateForBirthYear = getTemplateForBirthYear;
exports.getAgeGroupCode = getAgeGroupCode;
exports.getPositionsForTemplate = getPositionsForTemplate;
exports.getNumberForPosition = getNumberForPosition;
exports.getPositionForNumber = getPositionForNumber;
exports.getAllNumbersForTemplate = getAllNumbersForTemplate;
exports.isValidPositionKey = isValidPositionKey;
// 7+1 şablonu (2014-2018 doğumlu)
exports.TEMPLATE_7_PLUS_1 = [
    { positionKey: 'KALECI', number: 1 },
    { positionKey: 'SAG_DEF', number: 2 },
    { positionKey: 'STOPER', number: 4 },
    { positionKey: 'SOL_DEF', number: 3 },
    { positionKey: 'ORTA', number: 6 },
    { positionKey: 'SAG_KANAT', number: 7 },
    { positionKey: 'SOL_KANAT', number: 11 },
    { positionKey: 'FORVET', number: 9 }
];
// 10+1 şablonu (2006-2013 doğumlu)
exports.TEMPLATE_10_PLUS_1 = [
    { positionKey: 'KALECI', number: 1 },
    { positionKey: 'SAGBEK', number: 2 },
    { positionKey: 'SAG_STOPER', number: 4 },
    { positionKey: 'SOL_STOPER', number: 5 },
    { positionKey: 'SOLBEK', number: 3 },
    { positionKey: 'ONLIBERO', number: 6 },
    { positionKey: 'ORTA_8', number: 8 },
    { positionKey: 'ORTA_10', number: 10 },
    { positionKey: 'SAG_KANAT', number: 7 },
    { positionKey: 'SOL_KANAT', number: 11 },
    { positionKey: 'FORVET', number: 9 }
];
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
 * Şablona göre pozisyon listesi
 */
function getPositionsForTemplate(template) {
    return template === '7+1' ? exports.TEMPLATE_7_PLUS_1 : exports.TEMPLATE_10_PLUS_1;
}
/**
 * Pozisyon anahtarına göre forma numarası bulma
 */
function getNumberForPosition(template, positionKey) {
    const positions = getPositionsForTemplate(template);
    const position = positions.find(p => p.positionKey === positionKey);
    return position ? position.number : null;
}
/**
 * Forma numarasına göre pozisyon anahtarı bulma
 */
function getPositionForNumber(template, number) {
    const positions = getPositionsForTemplate(template);
    const position = positions.find(p => p.number === number);
    return position ? position.positionKey : null;
}
/**
 * Şablondaki tüm forma numaraları
 */
function getAllNumbersForTemplate(template) {
    return getPositionsForTemplate(template).map(p => p.number);
}
/**
 * Pozisyon anahtarının geçerli olup olmadığını kontrol etme
 */
function isValidPositionKey(template, positionKey) {
    const positions = getPositionsForTemplate(template);
    return positions.some(p => p.positionKey === positionKey);
}
