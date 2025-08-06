import React from "react";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type HeaderProps = {
  children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            Gratis Finder
          </span>
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;
