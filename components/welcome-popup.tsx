"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Calendar, MapPin } from "lucide-react";

interface WelcomePopupProps {
  bannerImageUrl?: string;
  bannerTitle?: string;
  bannerLinkUrl?: string;
}

export function WelcomePopup({
  bannerImageUrl,
  bannerTitle,
  bannerLinkUrl,
}: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // localStorage'da popup'ın daha önce gösterilip gösterilmediğini kontrol et
    const hasSeenPopup = localStorage.getItem("hasSeenWelcomePopup");
    
    if (!hasSeenPopup) {
      // Sayfa yüklendikten sonra küçük bir gecikme ile popup'ı göster
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Popup'ın gösterildiğini localStorage'a kaydet
    localStorage.setItem("hasSeenWelcomePopup", "true");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Sol Taraf - Görsel */}
          {bannerImageUrl && (
            <div className="relative h-64 md:h-auto min-h-[300px]">
              <Image
                src={bannerImageUrl}
                alt={bannerTitle || "Futbolcu Seçmeleri"}
                fill
                className="object-cover"
                unoptimized={bannerImageUrl.startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          {/* Sağ Taraf - İçerik */}
          <div className="flex flex-col p-6 md:p-8 bg-white relative">
            <DialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                <span>Haziran 2026</span>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Türkiye'nin En Büyük Futbolcu Seçmeleri
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 space-y-2">
                <p>
                  Profesyonel futbol kariyerinize adım atmak için eşsiz bir fırsat!
                </p>
                <div className="flex items-center gap-2 text-gray-700 mt-3">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Yalova'da başlıyor</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Yeteneklerinizi sergileyin, profesyonel antrenörlerle çalışma fırsatı yakalayın.
                  Geleceğin futbol yıldızları arasına katılın!
                </p>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-3">
              <Button
                asChild
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12"
                onClick={handleClose}
              >
                <Link href="/auth">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Hemen Kaydol
                </Link>
              </Button>
              
              {bannerLinkUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                  onClick={handleClose}
                >
                  <Link href={bannerLinkUrl}>
                    Daha Fazla Bilgi
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

