import React from 'react';
import { Sparkles, BookOpen, Compass, Shield, Sword, ScrollText } from 'lucide-react';
import { HERO_BANNER_IMG } from '../data/historicalPresets';
import { HistoricalSagaPreset } from '../types/comic';

interface ComicHeroBannerProps {
  sagas: HistoricalSagaPreset[];
  activeSagaId: string;
  onSelectSaga: (saga: HistoricalSagaPreset) => void;
  onOpenCreator: () => void;
}

export const ComicHeroBanner: React.FC<ComicHeroBannerProps> = ({
  sagas,
  activeSagaId,
  onSelectSaga,
  onOpenCreator,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#171410] border-b-4 border-[#2A2318]">
      {/* Background Graphic with Vignette Scrim */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        <img
          src={HERO_BANNER_IMG}
          alt="Indian Historical Comic Art Montage"
          className="w-full h-full object-cover object-center filter contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14120E] via-[#14120E]/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#14120E]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Comic Metadata & Title */}
          <div className="max-w-2xl">
            {/* Unboxed Metadata Header */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E5A93B] mb-2 font-mono">
              <span>Vol. 1</span>
              <span aria-hidden="true">·</span>
              <span>Indian Graphic Chronicles</span>
              <span aria-hidden="true">·</span>
              <span>Powered by Gemini 3.8</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-comic text-[#FBF6EC] tracking-wide uppercase drop-shadow-[3px_3px_0px_#000] leading-none mb-3">
              Forge The Legends Of Indian History In Comic Ink
            </h1>

            <p className="text-sm sm:text-base text-[#D4C4AA] leading-relaxed mb-6 font-serif max-w-xl">
              From the midnight siege of Kondhana with Shivaji Maharaj to the warrior queen of Jhansi and Emperor Ashoka’s Dharma edicts — orchestrate authentic graphic novels with authentic Amar Chitra Katha dialogue, onomatopoeia sound bursts, and verified chronicles.
            </p>

            {/* Quick Sagas Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#A18868] font-mono mr-1">
                Featured Sagas:
              </span>
              {sagas.map((saga) => {
                const isActive = saga.id === activeSagaId;
                return (
                  <button
                    key={saga.id}
                    onClick={() => onSelectSaga(saga)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#E5A93B] text-[#14120E] font-bold shadow-[2px_2px_0px_#000] scale-105'
                        : 'bg-[#221C14] hover:bg-[#2F271D] text-[#D8C7AF] border border-[#3C3224]'
                    }`}
                  >
                    {saga.eraTag.includes('Maratha') && <Shield className="w-3 h-3 text-[#E26D16]" />}
                    {saga.eraTag.includes('Independence') && <Sword className="w-3 h-3 text-[#E26D16]" />}
                    {saga.eraTag.includes('Mauryan') && <ScrollText className="w-3 h-3 text-[#E26D16]" />}
                    <span>{saga.title}</span>
                  </button>
                );
              })}

              <button
                onClick={onOpenCreator}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-[#E26D16]/20 hover:bg-[#E26D16]/30 text-[#E5A93B] border border-[#E26D16]/40 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 text-[#E5A93B]" />
                <span>+ Custom Indian Era</span>
              </button>
            </div>
          </div>

          {/* Right Column: Comic Issue Box Preview */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="w-64 bg-[#FAF5E8] text-[#14120E] p-3 rounded border-4 border-[#14120E] shadow-[8px_8px_0px_#000] rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between border-b-2 border-[#14120E] pb-1.5 mb-2">
                <span className="font-comic text-xs tracking-widest text-[#E26D16]">
                  AMAR KATHA CLASSICS
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#14120E] text-[#FFF] px-1 rounded">
                  ₹ 5.00
                </span>
              </div>
              <div className="relative aspect-[3/4] bg-[#221C14] rounded overflow-hidden mb-2 border-2 border-[#14120E]">
                <img
                  src={sagas.find((s) => s.id === activeSagaId)?.coverImage || HERO_BANNER_IMG}
                  alt="Comic Issue Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent p-2 text-center">
                  <span className="font-comic text-base text-[#FDF8EE] uppercase leading-tight block drop-shadow-[2px_2px_0px_#000]">
                    {sagas.find((s) => s.id === activeSagaId)?.title || 'INDIAN HEROES'}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-center font-serif text-[#5E5142] italic">
                Illustrated Graphic Chronicle
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
