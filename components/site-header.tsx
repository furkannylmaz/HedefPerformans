"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/services", label: "Bireysel Hizmetler" },
    { href: "/academy", label: "Futbol Koleji" },
    { href: "/movement-training", label: "Temel Hareket Eğitimi" },
    { href: "/about", label: "Hakkımızda" },
    { href: "/contact", label: "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <Image
              src="/logohedef.png"
              alt="Hedef Performans Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              Hedef Performans
            </span>
          </Link>

          {/* Desktop Navigation - Orta kısım */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center mx-4">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 whitespace-nowrap"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Desktop Auth Buttons - Sağ taraf */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Link href="/auth">
                <UserPlus className="mr-2 h-4 w-4" />
                Kayıt Ol
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/auth">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Kayıt Ol
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
