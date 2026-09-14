import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X, Check, ArrowRight, Clock } from 'lucide-react';

interface ModernDateRangeButtonProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  isActive?: boolean;
  onClear?: () => void;
  className?: string;
}

export const ModernDateRangeButton: React.FC<ModernDateRangeButtonProps> = ({
  startDate,
  endDate,
  onChange,
  isActive = false,
  onClear,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Sync state when props change
  useEffect(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
  }, [startDate, endDate]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Format dates for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: parts[0] !== '2026' ? 'numeric' : undefined,
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Preset handlers
  const applyPreset = (daysBack: number) => {
    const today = new Date(2026, 8, 14); // reference app date 14 Sept 2026
    const start = new Date(today);
    start.setDate(today.getDate() - daysBack);

    const toYMD = (d: Date) => d.toISOString().split('T')[0];
    const s = toYMD(start);
    const e = toYMD(today);

    setLocalStart(s);
    setLocalEnd(e);
    onChange(s, e);
    setIsOpen(false);
  };

  const applyThisMonth = () => {
    const s = '2026-09-01';
    const e = '2026-09-14';
    setLocalStart(s);
    setLocalEnd(e);
    onChange(s, e);
    setIsOpen(false);
  };

  const applyThisYear = () => {
    const s = '2026-01-01';
    const e = '2026-09-14';
    setLocalStart(s);
    setLocalEnd(e);
    onChange(s, e);
    setIsOpen(false);
  };

  const applyLastYear = () => {
    const s = '2025-01-01';
    const e = '2025-12-31';
    setLocalStart(s);
    setLocalEnd(e);
    onChange(s, e);
    setIsOpen(false);
  };

  // Calculate days span
  const daysDifference = () => {
    if (!localStart || !localEnd) return null;
    const start = new Date(localStart).getTime();
    const end = new Date(localEnd).getTime();
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff + 1 : null;
  };

  const handleApply = () => {
    if (localStart && localEnd) {
      // Ensure start is before end
      if (localStart > localEnd) {
        onChange(localEnd, localStart);
      } else {
        onChange(localStart, localEnd);
      }
      setIsOpen(false);
    }
  };

  const daysCount = daysDifference();

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Modern Trigger Button */}
      <div className="flex items-center">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
            isActive
              ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-xs'
              : 'bg-white hover:bg-[#f8fafc] text-[#0b1c30] border-[#cbd5e1] hover:border-[#94a3b8] shadow-2xs'
          }`}
        >
          <Calendar
            className={`w-3.5 h-3.5 transition-colors ${
              isActive ? 'text-blue-300' : 'text-[#64748b] group-hover:text-[#0b1c30]'
            }`}
          />
          {isActive ? (
            <span className="flex items-center gap-1.5 font-semibold">
              <span>{formatDateDisplay(startDate)}</span>
              <ArrowRight className="w-3 h-3 text-white/70" />
              <span>{formatDateDisplay(endDate)}</span>
            </span>
          ) : (
            <span>Fourchette de dates</span>
          )}
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              isActive ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#64748b]'
            }`}
          >
            {isActive ? 'Actif' : 'Personnaliser'}
          </span>
        </button>

        {/* Quick clear button if active */}
        {isActive && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            title="Réinitialiser la période"
            className="ml-1 p-1.5 rounded-lg text-[#64748b] hover:text-[#0b1c30] hover:bg-[#e2e8f0] bg-white border border-[#cbd5e1] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Modern Popover Dropdown */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-2 right-0 sm:left-0 sm:right-auto w-[330px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-[#cbd5e1] p-4 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0b1c30]/5 flex items-center justify-center text-[#0b1c30]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#0b1c30] leading-tight">
                  Fourchette de dates
                </h4>
                <p className="text-[11px] text-[#64748b]">
                  Sélectionnez une période précise d'analyse
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#94a3b8] hover:text-[#0b1c30] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Badges */}
          <div className="pt-3 pb-3">
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
              Raccourcis rapides
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(7)}
                className="px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#334155] hover:text-white border border-[#e2e8f0] hover:border-[#0b1c30] text-[11px] font-medium transition-colors cursor-pointer"
              >
                7 derniers jours
              </button>
              <button
                type="button"
                onClick={() => applyPreset(30)}
                className="px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#334155] hover:text-white border border-[#e2e8f0] hover:border-[#0b1c30] text-[11px] font-medium transition-colors cursor-pointer"
              >
                30 derniers jours
              </button>
              <button
                type="button"
                onClick={applyThisMonth}
                className="px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#334155] hover:text-white border border-[#e2e8f0] hover:border-[#0b1c30] text-[11px] font-medium transition-colors cursor-pointer"
              >
                Ce mois-ci
              </button>
              <button
                type="button"
                onClick={applyThisYear}
                className="px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#334155] hover:text-white border border-[#e2e8f0] hover:border-[#0b1c30] text-[11px] font-medium transition-colors cursor-pointer"
              >
                Cette année (2026)
              </button>
              <button
                type="button"
                onClick={applyLastYear}
                className="px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#334155] hover:text-white border border-[#e2e8f0] hover:border-[#0b1c30] text-[11px] font-medium transition-colors cursor-pointer"
              >
                2025
              </button>
            </div>
          </div>

          {/* Dual Date Inputs */}
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={localStart}
                  onChange={(e) => setLocalStart(e.target.value)}
                  className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[12px] font-mono text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#0b1c30] focus:border-[#0b1c30] shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={localEnd}
                  onChange={(e) => setLocalEnd(e.target.value)}
                  className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[12px] font-mono text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#0b1c30] focus:border-[#0b1c30] shadow-2xs"
                />
              </div>
            </div>

            {/* Interval preview pill */}
            {daysCount !== null && (
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#64748b]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1e40af]" />
                  <span>Étendue temporelle :</span>
                </span>
                <span className="font-bold text-[#0b1c30] bg-white px-2 py-0.5 rounded border border-[#e2e8f0]">
                  {daysCount} jour{daysCount > 1 ? 's' : ''} d'analyse
                </span>
              </div>
            )}
          </div>

          {/* Popover Actions */}
          <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-[#64748b] hover:text-[#dc2626] transition-colors cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-lg text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f1f5f9] text-[12px] font-medium transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!localStart || !localEnd}
                className="px-3.5 py-1.5 rounded-lg bg-[#0b1c30] hover:bg-[#1e40af] disabled:opacity-50 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Appliquer la période</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
