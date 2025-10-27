// Kadro pozisyonları ve forma numaraları
// Hedef Performans - Kadro Atama Sistemi

export type TemplateType = '7+1' | '10+1'

export interface PositionSlot {
  positionKey: string
  number: number
}

// KANONIK pozisyon anahtarları - TAM LISTE
export type PositionKey =
  // 7+1 şablonu
  | 'KALECI' | 'SAG_DEF' | 'STOPER' | 'SOL_DEF' | 'ORTA' | 'SAG_KANAT' | 'SOL_KANAT' | 'FORVET'
  // 10+1 şablonu
  | 'SAGBEK' | 'SAG_STOPER' | 'SOL_STOPER' | 'SOLBEK' | 'ONLIBERO' | 'ORTA_8' | 'ORTA_10'

// UI Etiketi → KANONIK KEY mapping
export const POSITION_NORMALIZATION_MAP: Record<string, PositionKey> = {
  // 7+1 Pozisyonları
  'KALE': 'KALECI',
  'KALECI': 'KALECI',
  'SAĞ BEK': 'SAG_DEF',
  'SAĞ BEKLER': 'SAG_DEF',
  'SAG_BEK': 'SAG_DEF',
  'SAĞ BEKER': 'SAG_DEF',
  'SAG_DEF': 'SAG_DEF',
  'SAĞ DEFANS': 'SAG_DEF',
  'STOPER': 'STOPER',
  'STOPERLER': 'STOPER',
  'SOL BEK': 'SOL_DEF',
  'SOL BEKLER': 'SOL_DEF',
  'SOL_BEK': 'SOL_DEF',
  'SOL BEKER': 'SOL_DEF',
  'SOL_DEF': 'SOL_DEF',
  'SOL DEFANS': 'SOL_DEF',
  'ORTA': 'ORTA',
  'ORTA SAHA': 'ORTA',
  'ORTASAHA': 'ORTA',
  'SAĞ KANAT': 'SAG_KANAT',
  'SAG KANAT': 'SAG_KANAT',
  'SAG_KANAT': 'SAG_KANAT',
  'SOL KANAT': 'SOL_KANAT',
  'SOL KANAT': 'SOL_KANAT',
  'SOL_KANAT': 'SOL_KANAT',
  'FORVET': 'FORVET',
  'FORVETLER': 'FORVET',
  
  // 10+1 Pozisyonları
  'SAGBEK': 'SAGBEK',
  'SAĞ BEK': 'SAGBEK',
  'SAG_STOPER': 'SAG_STOPER',
  'SAĞ STOPER': 'SAG_STOPER',
  'SOL_STOPER': 'SOL_STOPER',
  'SOL STOPER': 'SOL_STOPER',
  'SOLBEK': 'SOLBEK',
  'SOL BEK': 'SOLBEK',
  'ONLIBERO': 'ONLIBERO',
  'ÖNLİBERO': 'ONLIBERO',
  'ONLİBERO': 'ONLIBERO',
  'ORTA 8': 'ORTA_8',
  'ORTA_8': 'ORTA_8',
  'ORTA 10': 'ORTA_10',
  'ORTA_10': 'ORTA_10',
}

// 7+1 şablonu (2014-2018 doğumlu)
export const TEMPLATE_7_PLUS_1: PositionSlot[] = [
  { positionKey: 'KALECI', number: 1 },
  { positionKey: 'SAG_DEF', number: 2 },
  { positionKey: 'STOPER', number: 4 },
  { positionKey: 'SOL_DEF', number: 3 },
  { positionKey: 'ORTA', number: 6 },
  { positionKey: 'SAG_KANAT', number: 7 },
  { positionKey: 'SOL_KANAT', number: 11 },
  { positionKey: 'FORVET', number: 9 }
]

// 10+1 şablonu (2006-2013 doğumlu)
export const TEMPLATE_10_PLUS_1: PositionSlot[] = [
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
]

/**
 * Doğum yılına göre şablon seçimi
 */
export function getTemplateForBirthYear(birthYear: number): TemplateType {
  if (birthYear >= 2014 && birthYear <= 2018) {
    return '7+1'
  } else if (birthYear >= 2006 && birthYear <= 2013) {
    return '10+1'
  }
  throw new Error(`Desteklenmeyen doğum yılı: ${birthYear}`)
}

/**
 * Yaş grubu kodu oluşturma - U2012 formatında
 */
export function getAgeGroupCode(birthYear: number): string {
  return `U${birthYear}`
}

/**
 * Şablona göre pozisyon listesi
 */
export function getPositionsForTemplate(template: TemplateType): PositionSlot[] {
  return template === '7+1' ? TEMPLATE_7_PLUS_1 : TEMPLATE_10_PLUS_1
}

/**
 * Pozisyon anahtarına göre forma numarası bulma
 */
export function getNumberForPosition(template: TemplateType, positionKey: string): number | null {
  const positions = getPositionsForTemplate(template)
  const position = positions.find(p => p.positionKey === positionKey)
  return position ? position.number : null
}

/**
 * Forma numarasına göre pozisyon anahtarı bulma
 */
export function getPositionForNumber(template: TemplateType, number: number): string | null {
  const positions = getPositionsForTemplate(template)
  const position = positions.find(p => p.number === number)
  return position ? position.positionKey : null
}

/**
 * Şablondaki tüm forma numaraları
 */
export function getAllNumbersForTemplate(template: TemplateType): number[] {
  return getPositionsForTemplate(template).map(p => p.number)
}

/**
 * Pozisyon anahtarının geçerli olup olmadığını kontrol etme
 */
export function isValidPositionKey(template: TemplateType, positionKey: string): boolean {
  const positions = getPositionsForTemplate(template)
  return positions.some(p => p.positionKey === positionKey)
}

/**
 * UI etiketi/input → KANONIK KEY normalizasyonu
 * UI etiketi ("Sağ Bek", "Sağ Defans"...), küçük/büyük, Türkçe karakter → KANONIK KEY'e map et
 * KANONIK sözlükte yoksa throw
 */
export function normalizePositionKey(input: string, template: '7+1' | '10+1'): PositionKey {
  // Input'u normalize et: büyük harf, boşluk trim
  const normalized = input.trim().toUpperCase()
  
  // Mapping'de ara (normalize edilmiş input)
  const mapped = POSITION_NORMALIZATION_MAP[normalized]
  
  if (mapped) {
    return mapped
  }
  
  // Direct key olabilir
  if (isValidPositionKey(template, normalized)) {
    return normalized as PositionKey
  }
  
  // Bulunamadı - throw
  throw new Error(`Geçersiz pozisyon: "${input}". Template: ${template}`)
}

/**
 * STRICT pozisyon validasyonu (template'e uygun mu?)
 * @param key - Position key
 * @param template - Template ('7+1' | '10+1')
 * @returns boolean (strict true/false)
 */
export function validatePositionForTemplate(key: string, template: '7+1' | '10+1'): boolean {
  const positions = getPositionsForTemplate(template)
  return positions.some(p => p.positionKey === key)
}
