"use client"

import { useEffect, useState } from "react"
import { ContactPageContent, defaultContactPageContent } from "@/lib/pages-content"

export function useContactPageContent() {
  const [content, setContent] = useState<ContactPageContent | null>(null)

  useEffect(() => {
    fetch("/api/pages?key=contactPage")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContent(data.data)
        } else {
          setContent(defaultContactPageContent)
        }
      })
      .catch(() => {
        setContent(defaultContactPageContent)
      })
  }, [])

  return content
}

