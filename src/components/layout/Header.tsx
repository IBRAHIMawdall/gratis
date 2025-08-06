import React from "react";
import Logo from "@/components/icons/Logo";

type HeaderProps = {
  children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">
            Gratis Finder
          </span>
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;
