// Queue İsimleri Standardizasyonu
// Hedef Performans - Kadro Atama Sistemi

/**
 * Queue ismi oluşturma fonksiyonu
 * Kural: SADECE harf-rakam-tire karakterleri kullanılabilir
 * BullMQ'da ':' karakteri kullanılamaz
 */
export function assignQueueName(ageGroupCode: string, template: '7+1' | '10+1'): string {
  // Template mapping: '7+1' → '7p1', '10+1' → '10p1'
  const templateMap = {
    '7+1': '7p1',
    '10+1': '10p1'
  }
  
  const mappedTemplate = templateMap[template]
  
  // Format: assign-{ageGroupCode}-{template}
  return `assign-${ageGroupCode}-${mappedTemplate}`
}

/**
 * Desteklenen yaş grupları
 */
export const SUPPORTED_AGE_GROUPS = [
  'U2006', 'U2007', 'U2008', 'U2009', 'U2010', 'U2011', 'U2012', 
  'U2013', 'U2014', 'U2015', 'U2016', 'U2017', 'U2018'
] as const

/**
 * Desteklenen şablonlar
 */
export const SUPPORTED_TEMPLATES = ['7+1', '10+1'] as const

/**
 * Tüm queue isimlerini oluştur
 */
export function getAllQueueNames(): string[] {
  const queueNames: string[] = []
  
  for (const ageGroup of SUPPORTED_AGE_GROUPS) {
    for (const template of SUPPORTED_TEMPLATES) {
      queueNames.push(assignQueueName(ageGroup, template))
    }
  }
  
  return queueNames
}
