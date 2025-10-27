// Squad Oluşturma Politikaları
// Hedef Performans - Kadro Atama Sistemi

/**
 * Squad oluşturma için yapılandırma
 * 
 * MAX_OPEN: Aynı anda açık (ACTIVE) kadro limiti
 * MIN_FILL_TO_OPEN_NEXT: Yeni kadro açmak için minimum doluluk oranı (%)
 */
export const SQUAD_CREATE = {
  MAX_OPEN: parseInt(process.env.SQUAD_MAX_OPEN ?? '6'),
  MIN_FILL_TO_OPEN_NEXT: parseInt(process.env.SQUAD_MIN_FILL ?? '80'),
}

/**
 * Squad politikasını logla
 */
export function logSquadPolicy() {
  console.log(`[SQUAD-POLICY] MAX_OPEN: ${SQUAD_CREATE.MAX_OPEN}, MIN_FILL_TO_OPEN_NEXT: ${SQUAD_CREATE.MIN_FILL_TO_OPEN_NEXT}%`)
}

