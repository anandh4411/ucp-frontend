import React from "react";

interface SidebarBrandProps {
  logo: React.ReactNode;
  name: string;
  className?: string;
  onNavigate?: (path: string) => void;
}

export function SidebarBrand({
  logo,
  name,
  className = "",
  onNavigate,
}: SidebarBrandProps) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate("/");
    } else {
      // SPA-friendly navigation
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <div
      className={`w-fit flex items-center px-1 transition-all duration-300 ease-in-out cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="p-2 h-auto w-12 rounded-md flex items-center justify-center mr-3 group-data-[collapsible=icon]:mr-0 transition-all duration-300 ease-in-out">
        {logo}
      </div>
      <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden transition-opacity duration-300 ease-in-out">
        {name}
      </span>
    </div>
  );
}
