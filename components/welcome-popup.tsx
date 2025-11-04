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
import {
  X,
  ArrowRight,
  Calendar,
  MapPin,
  MessageCircle,
  Instagram,
} from "lucide-react";

interface WelcomePopupProps {
  bannerImageUrl?: string;
  bannerTitle?: string;
  bannerLinkUrl?: string;
  whatsappUrl?: string;
  instagramUrl?: string;
}

export function WelcomePopup({
  bannerImageUrl,
  bannerTitle,
  bannerLinkUrl,
  whatsappUrl,
  instagramUrl,
}: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Her anasayfa açılışında popup'ı göster
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-full sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2">
          {/* Üst/Sol Taraf - Görsel */}
          {bannerImageUrl && (
            <div className="relative h-48 sm:h-64 md:h-auto md:min-h-[400px] w-full flex items-center justify-center bg-gray-100">
              <Image
                src={bannerImageUrl}
                alt={bannerTitle || "Futbolcu Seçmeleri"}
                fill
                className="object-contain"
                unoptimized={bannerImageUrl.startsWith("http")}
              />
            </div>
          )}

          {/* Alt/Sağ Taraf - İçerik */}
          <div className="flex flex-col p-4 sm:p-6 md:p-8 bg-white relative">
            <DialogHeader className="text-left space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm font-semibold">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Haziran 2026</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Türkiye'nin En Büyük Futbolcu Seçmeleri
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600 space-y-2">
                <p>
                  Profesyonel futbol kariyerinize adım atmak için eşsiz bir
                  fırsat!
                </p>
                <div className="flex items-center gap-2 text-gray-700 mt-2 sm:mt-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Yalova'da başlıyor
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Yeteneklerinizi sergileyin, profesyonel antrenörlerle çalışma
                  fırsatı yakalayın. Geleceğin futbol yıldızları arasına
                  katılın!
                </p>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              <Button
                asChild
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base"
                onClick={handleClose}
              >
                <Link href="/auth" className="flex items-center justify-center">
                  <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Hemen Kaydol
                </Link>
              </Button>

              {bannerLinkUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-11 sm:h-12 text-sm sm:text-base"
                  onClick={handleClose}
                >
                  <Link
                    href={bannerLinkUrl}
                    className="flex items-center justify-center"
                  >
                    Daha Fazla Bilgi
                  </Link>
                </Button>
              )}

              {/* Sosyal Medya Butonları */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                {whatsappUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50 h-11 sm:h-12 text-sm sm:text-base"
                    onClick={handleClose}
                  >
                    <Link
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      WhatsApp
                    </Link>
                  </Button>
                )}

                {instagramUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 h-11 sm:h-12 text-sm sm:text-base"
                    onClick={handleClose}
                  >
                    <Link
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Instagram className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Instagram
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
