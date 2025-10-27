import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ageGroupCode = searchParams.get('ageGroupCode') || 'U2016'
    const template = searchParams.get('template') || '7+1'
    
    // Basit test response
    return NextResponse.json({
      success: true,
      data: {
        ageGroupCode,
        template,
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        total: 0,
        message: 'Queue API çalışıyor'
      }
    })
    
  } catch (error: any) {
    console.error('Queue durumu kontrol hatası:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
