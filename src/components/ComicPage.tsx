import React, { useRef } from 'react';
import { ComicStory, ComicPanel } from '../types/comic';
import { ComicPanelItem } from './ComicPanelItem';
import { Shield, Sparkles, BookOpen, Volume2, Share2, Printer } from 'lucide-react';

interface ComicPageProps {
  story: ComicStory;
  onEditPanel: (panel: ComicPanel) => void;
  onRegeneratePanel: (panelNumber: number) => void;
  onPlayPanelAudio: (panel: ComicPanel) => void;
  onUpdateBalloonText: (panelIndex: number, balloonId: string, newText: string) => void;
  playingPanelNumber: number | null;
}

export const ComicPage: React.FC<ComicPageProps> = ({
  story,
  onEditPanel,
  onRegeneratePanel,
  onPlayPanelAudio,
  onUpdateBalloonText,
  playingPanelNumber,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="relative max-w-6xl mx-auto my-6 sm:my-10 bg-[#FAF5E8] text-[#14120E] p-4 sm:p-6 lg:p-8 rounded-sm border-4 sm:border-8 border-[#14120E] shadow-[12px_12px_0px_#000] overflow-hidden"
    >
      {/* Background Vintage Paper Grain Texture */}
      <div className="absolute inset-0 comic-halftone opacity-25 pointer-events-none" />

      {/* Header Banner: Authentic Amar Chitra Katha Classic Style */}
      <div className="relative z-10 border-b-4 border-[#14120E] pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#14120E] pb-2 mb-3 gap-2">
          {/* Top Left Metadata */}
          <div className="flex items-center gap-2">
            <span className="bg-[#E26D16] text-[#FFF] font-comic text-xs uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#000] rotate-[-1deg]">
              INDIAN CLASSICS
            </span>
            <span className="text-xs font-mono font-bold text-[#554A3B]">
              ISSUE #{story.issueNumber} · {story.eraTag}
            </span>
          </div>

          {/* Top Right Vintage Price Stamp */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-serif font-bold text-[#8C2513] uppercase tracking-wider">
              {story.yearPeriod}
            </span>
            <span className="bg-[#FEE028] text-[#14120E] border border-[#14120E] text-[11px] font-mono font-black px-1.5 py-0.2 shadow-[1px_1px_0px_#000]">
              PRICE ₹ 5.00
            </span>
          </div>
        </div>

        {/* Grand Comic Title */}
        <div className="text-center my-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-comic text-[#14120E] tracking-wider uppercase leading-none drop-shadow-[2px_2px_0px_#E26D16]">
            {story.title}
          </h2>
          {story.subtitle && (
            <p className="text-xs sm:text-sm font-serif font-bold text-[#6B5A46] tracking-widest uppercase mt-1">
              {story.subtitle}
            </p>
          )}
        </div>

        {/* Dramatic Slogan / Tagline Banner */}
        {story.tagline && (
          <div className="bg-[#E26D16] text-white py-1 px-4 text-center border-2 border-[#14120E] shadow-[3px_3px_0px_#000] my-2 rotate-[-0.5deg]">
            <span className="font-comic text-sm sm:text-base tracking-wider uppercase drop-shadow-[1px_1px_0px_#000]">
              {story.tagline}
            </span>
          </div>
        )}
      </div>

      {/* Main Dynamic Panel Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-4">
        {story.panels.map((panel, idx) => (
          <ComicPanelItem
            key={panel.panelNumber}
            panel={panel}
            panelIndex={idx}
            totalPanels={story.panels.length}
            eraTag={story.eraTag}
            onEditPanel={onEditPanel}
            onRegeneratePanel={onRegeneratePanel}
            onPlayPanelAudio={onPlayPanelAudio}
            onUpdateBalloonText={(balloonId, newText) =>
              onUpdateBalloonText(idx, balloonId, newText)
            }
            isAudioPlaying={playingPanelNumber === panel.panelNumber}
          />
        ))}
      </div>

      {/* Comic Page Footer: Vintage Credits & Publisher Ribbon */}
      <div className="relative z-10 mt-8 pt-4 border-t-4 border-[#14120E] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#665A48] gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#E26D16] uppercase">Comics Craft</span>
          <span>·</span>
          <span>Scripted & Directed with Gemini 3.8 Flash</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="italic font-serif">Page 1 of 1 · Complete Episode</span>
          <span className="font-bold text-[#14120E]">
            Authentic Indian Historical Graphics
          </span>
        </div>
      </div>
    </div>
  );
};
