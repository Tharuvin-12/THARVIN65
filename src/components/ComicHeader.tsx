import React from 'react';
import { Sparkles, BookOpen, Volume2, FileText, Download, History } from 'lucide-react';

interface ComicHeaderProps {
  onOpenCreator: () => void;
  onOpenLore: () => void;
  onOpenScript: () => void;
  onToggleMotionMode: () => void;
  isMotionModeActive: boolean;
  onExport: () => void;
  currentIssueTitle: string;
}

export const ComicHeader: React.FC<ComicHeaderProps> = ({
  onOpenCreator,
  onOpenLore,
  onOpenScript,
  onToggleMotionMode,
  isMotionModeActive,
  onExport,
  currentIssueTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#16130F]/95 backdrop-blur-md border-b-2 border-[#2C251C] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="group flex items-center gap-2 text-2xl lg:text-3xl font-comic tracking-wider text-[#F5E6CC] hover:text-[#E26D16] transition-colors"
          >
            <span className="bg-[#E26D16] text-[#14120E] px-2 py-0.5 rounded shadow-[2px_2px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform">
              COMICS
            </span>
            <span className="font-comic text-[#F5E6CC] tracking-widest drop-shadow-[2px_2px_0px_#000]">
              CRAFT
            </span>
          </a>
          <span className="hidden sm:inline-block text-xs font-serif text-[#C4A47C]/80 italic pl-2 border-l border-[#3D3426]">
            Indian Historical Graphic Storyteller
          </span>
        </div>

        {/* Zone 2: 4 Clean nav buttons with single-line labels */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={onOpenLore}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C4A47C] hover:text-[#F3EFE6] hover:bg-[#262018] rounded-md transition-colors whitespace-nowrap"
          >
            <History className="w-3.5 h-3.5 text-[#E5A93B]" />
            <span>Chronicles & Lore</span>
          </button>

          <button
            onClick={onOpenScript}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C4A47C] hover:text-[#F3EFE6] hover:bg-[#262018] rounded-md transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#E5A93B]" />
            <span>Comic Script</span>
          </button>

          <button
            onClick={onToggleMotionMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              isMotionModeActive
                ? 'bg-[#E5A93B] text-[#14120E] font-bold shadow-[2px_2px_0px_#000]'
                : 'text-[#C4A47C] hover:text-[#F3EFE6] hover:bg-[#262018]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isMotionModeActive ? 'Exit Motion Reader' : 'Motion Narrator'}</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C4A47C] hover:text-[#F3EFE6] hover:bg-[#262018] rounded-md transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#E5A93B]" />
            <span>Export Strip</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreator}
            className="group relative inline-flex items-center gap-2 bg-[#E26D16] hover:bg-[#F27822] text-[#14120E] px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#14120E] group-hover:rotate-12 transition-transform" />
            <span>Create Comic with Gemini</span>
          </button>
        </div>
      </div>
    </header>
  );
};
