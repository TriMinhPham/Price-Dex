'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import SearchBar from './SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#111827]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-[#3b82f6] to-cyan-400 bg-clip-text text-transparent">
                Price
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-[#3b82f6] bg-clip-text text-transparent">
                Dex
              </span>
            </div>
            <span className="text-xl">📡</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#e2e8f0] transition-colors hover:text-[#3b82f6]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-md md:block">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#e2e8f0] hover:text-[#3b82f6]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-[#1e293b] py-4 md:hidden">
            <nav className="space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-[#e2e8f0] transition-colors hover:text-[#3b82f6]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#1e293b]">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
