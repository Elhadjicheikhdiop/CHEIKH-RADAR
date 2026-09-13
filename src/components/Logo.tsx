import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showSubtitle = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon: dark rounded square with clean red accent dot/dash */}
      <div className="relative w-6 h-6 rounded-md bg-[#0b1c30] flex items-center justify-center shrink-0 shadow-xs">
        {/* White horizontal line */}
        <div className="w-2.5 h-[2px] bg-white rounded-full"></div>
        {/* Red accent dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] ml-1"></div>
      </div>

      <div className="flex flex-col select-none">
        <div className="flex items-baseline leading-none gap-1">
          <span className="font-bold text-[15px] tracking-tight text-[#0b1c30]">PANAF</span>
          <span className="font-bold text-[15px] tracking-tight text-[#bb0112]">CHEIKH +</span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-mono font-semibold tracking-[0.16em] text-[#64748b] uppercase mt-1">
            Cellule Anti-Piratage
          </span>
        )}
      </div>
    </div>
  );
};
