// API Test - Register Endpoint Pozisyon Validasyonu
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest } from "next/server"
import { POST } from "@/app/api/auth/register/route"

// Test verileri
const validUserData = {
  firstName: "Test",
  lastName: "User",
  birthYear: 2016,
  mainPositionKey: "KALECI",
  altPositionKey: "SAG_DEF",
  country: "Turkey",
  city: "Istanbul",
  district: "Kadikoy",
  phone: "05551234567",
  email: "34sisman29@gmail.com",
  password: "123456",
  team: "Test Team",
  league: "Test League",
  termsAccepted: true
}

const invalidPositionData = {
  ...validUserData,
  birthYear: 2016, // 7+1 şablonu
  mainPositionKey: "SAGBEK" // Bu pozisyon 10+1 şablonunda var, 7+1'de yok
}

const invalidBirthYearData = {
  ...validUserData,
  birthYear: 2000, // Desteklenmeyen doğum yılı
  mainPositionKey: "KALECI"
}

async function testRegisterAPI() {
  console.log("🧪 API Test Başlatılıyor...")
  
  try {
    // Test 1: Geçerli veri
    console.log("\n✅ Test 1: Geçerli veri ile kayıt")
    const validRequest = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validUserData),
      headers: { "Content-Type": "application/json" }
    })
    
    const validResponse = await POST(validRequest)
    const validResult = await validResponse.json()
    
    if (validResult.success) {
      console.log("✅ Geçerli veri testi başarılı")
    } else {
      console.log("❌ Geçerli veri testi başarısız:", validResult.message)
    }
    
    // Test 2: Uyumsuz pozisyon
    console.log("\n❌ Test 2: Uyumsuz pozisyon ile kayıt")
    console.log("Test verisi:", JSON.stringify(invalidPositionData, null, 2))
    
    const invalidPositionRequest = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(invalidPositionData),
      headers: { "Content-Type": "application/json" }
    })
    
    const invalidPositionResponse = await POST(invalidPositionRequest)
    const invalidPositionResult = await invalidPositionResponse.json()
    
    console.log("Response:", JSON.stringify(invalidPositionResult, null, 2))
    
    if (!invalidPositionResult.success) {
      console.log("✅ Uyumsuz pozisyon testi başarılı - Hata yakalandı")
    } else {
      console.log("❌ Uyumsuz pozisyon testi başarısız - Hata yakalanmadı")
    }
    
    // Test 3: Geçersiz doğum yılı
    console.log("\n❌ Test 3: Geçersiz doğum yılı ile kayıt")
    console.log("Test verisi:", JSON.stringify(invalidBirthYearData, null, 2))
    
    const invalidBirthYearRequest = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(invalidBirthYearData),
      headers: { "Content-Type": "application/json" }
    })
    
    const invalidBirthYearResponse = await POST(invalidBirthYearRequest)
    const invalidBirthYearResult = await invalidBirthYearResponse.json()
    
    console.log("Response:", JSON.stringify(invalidBirthYearResult, null, 2))
    
    if (!invalidBirthYearResult.success) {
      console.log("✅ Geçersiz doğum yılı testi başarılı - Hata yakalandı")
    } else {
      console.log("❌ Geçersiz doğum yılı testi başarısız - Hata yakalanmadı")
    }
    
    console.log("\n🎯 API Test Tamamlandı!")
    
  } catch (error) {
    console.error("❌ API Test Hatası:", error)
  }
}

// Test çalıştır
if (require.main === module) {
  testRegisterAPI()
}

export { testRegisterAPI }
