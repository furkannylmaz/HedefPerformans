import { NextRequest, NextResponse } from "next/server"
import {
  getServicesPageContent,
  getAcademyPageContent,
  getMovementTrainingPageContent,
  getAboutPageContent,
  getContactPageContent,
  SERVICES_PAGE_KEY,
  ACADEMY_PAGE_KEY,
  MOVEMENT_TRAINING_PAGE_KEY,
  ABOUT_PAGE_KEY,
  CONTACT_PAGE_KEY,
} from "@/lib/site-settings"

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key")

  if (!key) {
    return NextResponse.json(
      { success: false, message: "key parametresi zorunlu" },
      { status: 400 }
    )
  }

  try {
    let data

    switch (key) {
      case SERVICES_PAGE_KEY:
        data = await getServicesPageContent()
        break
      case ACADEMY_PAGE_KEY:
        data = await getAcademyPageContent()
        break
      case MOVEMENT_TRAINING_PAGE_KEY:
        data = await getMovementTrainingPageContent()
        break
      case ABOUT_PAGE_KEY:
        data = await getAboutPageContent()
        break
      case CONTACT_PAGE_KEY:
        data = await getContactPageContent()
        break
      default:
        return NextResponse.json(
          { success: false, message: "Geçersiz key" },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[Pages][GET] error", error)
    return NextResponse.json(
      { success: false, message: "Veri yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

