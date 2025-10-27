import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sortBy = searchParams.get("sortBy") || "most_viewed"
    
    // TODO: Prisma ile veritabanı sorgusu
    // AdminMatch tablosundan verileri çek
    
    // Boş maç listesi - gerçek veriler veritabanından gelecek
    const matches: any[] = []
    
    // Sıralama
    let sortedMatches = [...matches]
    if (sortBy === "most_viewed") {
      sortedMatches.sort((a, b) => b.viewCount - a.viewCount)
    } else if (sortBy === "newest") {
      sortedMatches.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    }
    
    // Sayfalama
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMatches = sortedMatches.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: {
        matches: paginatedMatches,
        pagination: {
          page,
          limit,
          total: matches.length,
          hasMore: endIndex < matches.length
        }
      }
    })
    
  } catch (error) {
    console.error("Matches fetch error:", error)
    return NextResponse.json({
      success: false,
      message: "Maçlar yüklenirken bir hata oluştu"
    }, { status: 500 })
  }
}
