// Script: ASSIGN-POLICY-DUMP
// Hedef Performans - Atama politikası değerlerini kontrol et

import { SQUAD_CREATE, logSquadPolicy } from '../config/squads'

console.log('📋 Atama Politikası Değerleri:\n')

// Environment variables
console.log('🔧 Environment Variables:')
console.log(`   SQUAD_MAX_OPEN: ${process.env.SQUAD_MAX_OPEN ?? 'undefined (default: 6)'}`)
console.log(`   SQUAD_MIN_FILL: ${process.env.SQUAD_MIN_FILL ?? 'undefined (default: 80)'}`)
console.log(`   ASSIGN_ENABLED: ${process.env.ASSIGN_ENABLED ?? 'undefined (default: true)'}\n`)

// Runtime değerler
console.log('⚙️  Runtime Değerler:')
console.log(`   SQUAD_CREATE.MAX_OPEN: ${SQUAD_CREATE.MAX_OPEN}`)
console.log(`   SQUAD_CREATE.MIN_FILL_TO_OPEN_NEXT: ${SQUAD_CREATE.MIN_FILL_TO_OPEN_NEXT}%`)

console.log('\n📊 Policy Log:')
logSquadPolicy()

console.log('\n✅ Dosya: lib/squads/assign.ts')
console.log('   autoAssignUser fonksiyonu bu değerleri kullanıyor')
console.log('   Policy check: lib/squads/assign.ts satır 323-399')

