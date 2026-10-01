import React from 'react';
import { X, BookOpen, Shield, ScrollText, MapPin, Feather, CheckCircle } from 'lucide-react';
import { ComicStory } from '../types/comic';

interface HistoricalLoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  story: ComicStory;
}

export const HistoricalLoreDrawer: React.FC<HistoricalLoreDrawerProps> = ({
  isOpen,
  onClose,
  story,
}) => {
  if (!isOpen) return null;

  const { historicalContext, characters } = story;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-xl h-full bg-[#181410] text-[#F3EFE6] border-l-4 border-[#3A2E1E] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Halftone pattern */}
        <div className="absolute inset-0 comic-halftone opacity-5 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#2F2518] pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E5A93B] uppercase tracking-wider">
              <ScrollText className="w-4 h-4" />
              <span>Historical Chronicles & Lore</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#96836C] hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comic Title & Era Tag */}
          <div className="mb-6">
            <span className="text-[11px] font-mono text-[#E26D16] font-bold uppercase tracking-wider bg-[#261E14] px-2 py-0.5 rounded border border-[#3D3021]">
              {story.eraTag} · {story.yearPeriod}
            </span>
            <h2 className="text-2xl font-comic text-[#FBF6EC] tracking-wide uppercase mt-2">
              {story.title}
            </h2>
            <p className="text-xs font-serif text-[#C4B299] italic mt-0.5">
              {story.subtitle}
            </p>
          </div>

          {/* Historical Summary */}
          <div className="mb-6 bg-[#211A13] p-4 rounded border border-[#382C1E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] font-mono mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Historical Context</span>
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#E2D4C0] leading-relaxed">
              {historicalContext?.summary}
            </p>
            {historicalContext?.significance && (
              <div className="mt-3 pt-3 border-t border-[#33271A] text-xs font-serif text-[#C4B097]">
                <strong className="text-[#E26D16] font-mono uppercase block text-[10px] mb-0.5">
                  Significance in Indian History:
                </strong>
                {historicalContext.significance}
              </div>
            )}
          </div>

          {/* Primary Sources & Chronicles */}
          {historicalContext?.sourcesAndChronicles && historicalContext.sourcesAndChronicles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] font-mono mb-2 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-[#E26D16]" />
                <span>Primary Sources & Chronicles</span>
              </h3>
              <ul className="space-y-1.5">
                {historicalContext.sourcesAndChronicles.map((source, idx) => (
                  <li
                    key={idx}
                    className="text-xs font-mono text-[#C4B298] bg-[#1E1812] px-2.5 py-1.5 rounded border border-[#302518] flex items-center gap-2"
                  >
                    <CheckCircle className="w-3 h-3 text-[#E5A93B] shrink-0" />
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Locations */}
          {historicalContext?.primaryLocations && historicalContext.primaryLocations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] font-mono mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E26D16]" />
                <span>Historical Locations & Fortresses</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {historicalContext.primaryLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-serif text-[#E0D3BF] bg-[#292015] px-2.5 py-1 rounded border border-[#423422]"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Character Profiles */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] font-mono mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#E26D16]" />
              <span>Dramatis Personae (Character Dossiers)</span>
            </h3>
            <div className="space-y-3">
              {characters?.map((char, idx) => (
                <div
                  key={idx}
                  className="bg-[#211A13] p-3 rounded border border-[#382C1E] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-comic text-base text-[#FDF8EE] tracking-wide uppercase">
                      {char.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#E5A93B] bg-[#14120E] px-2 py-0.5 rounded border border-[#302518]">
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs font-serif text-[#C4B298]">
                    <strong className="text-[#8C7A65] font-mono text-[10px] uppercase block">
                      Visual Attire & Weapons:
                    </strong>
                    {char.visualDescription}
                  </p>
                  {char.historicalNotes && (
                    <p className="text-[11px] font-serif text-[#A3927C] italic">
                      {char.historicalNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-4 border-t border-[#2F2518] text-center">
          <p className="text-[10px] font-mono text-[#8C7A65]">
            Curated from classical Indian histories, bakhars, inscriptions & military chronicles.
          </p>
        </div>
      </div>
    </div>
  );
};
