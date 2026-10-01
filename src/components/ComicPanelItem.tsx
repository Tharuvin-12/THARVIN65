import React, { useState } from 'react';
import { ComicPanel, DialogueBalloon } from '../types/comic';
import { ComicArtRenderer } from './ComicArtRenderer';
import { SpeechBubble } from './SpeechBubble';
import { SoundEffectBurst } from './SoundEffectBurst';
import { Volume2, Edit3, Sparkles, BookOpen, Loader2 } from 'lucide-react';

interface ComicPanelItemProps {
  panel: ComicPanel;
  panelIndex: number;
  totalPanels: number;
  eraTag?: string;
  onEditPanel: (panel: ComicPanel) => void;
  onRegeneratePanel: (panelNumber: number) => void;
  onPlayPanelAudio: (panel: ComicPanel) => void;
  onUpdateBalloonText: (balloonId: string, newText: string) => void;
  isAudioPlaying?: boolean;
}

export const ComicPanelItem: React.FC<ComicPanelItemProps> = ({
  panel,
  panelIndex,
  totalPanels,
  eraTag,
  onEditPanel,
  onRegeneratePanel,
  onPlayPanelAudio,
  onUpdateBalloonText,
  isAudioPlaying = false,
}) => {
  const [showFact, setShowFact] = useState(false);

  // Column span classes
  const spanClass =
    panel.layoutSpan === 'splash'
      ? 'col-span-1 md:col-span-2 lg:col-span-3'
      : panel.layoutSpan === 'wide'
      ? 'col-span-1 md:col-span-2'
      : 'col-span-1';

  return (
    <div
      className={`group relative bg-[#FAF5E8] text-[#14120E] comic-panel-box rounded-xs overflow-hidden flex flex-col justify-between ${spanClass}`}
    >
      {/* Top Banner: Vintage Amar Chitra Katha Yellow Caption Box */}
      <div className="relative z-20 border-b-2 border-[#14120E] comic-caption-box px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-[#14120E] text-[#FFF] text-[10px] font-mono font-black px-1.5 py-0.5 rounded-xs shrink-0">
            {panel.panelNumber}
          </span>
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#14120E] truncate">
            {panel.captionBox}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {panel.historicalFactDetail && (
            <button
              onClick={() => setShowFact(!showFact)}
              className={`p-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                showFact
                  ? 'bg-[#E26D16] text-white'
                  : 'bg-[#14120E]/10 hover:bg-[#14120E]/20 text-[#14120E]'
              }`}
              title="View Historical Lore Fact"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Fact</span>
            </button>
          )}

          <button
            onClick={() => onPlayPanelAudio(panel)}
            disabled={isAudioPlaying}
            className={`p-1 rounded transition-colors ${
              isAudioPlaying
                ? 'bg-[#E26D16] text-white animate-pulse'
                : 'hover:bg-[#14120E]/20 text-[#14120E]'
            }`}
            title="Listen to Panel Narration"
          >
            {isAudioPlaying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => onEditPanel(panel)}
            className="p-1 hover:bg-[#14120E]/20 rounded text-[#14120E] transition-colors"
            title="Edit Dialogue & Panel Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Historical Fact Drawer Overlay */}
      {showFact && panel.historicalFactDetail && (
        <div className="relative z-30 bg-[#2C2418] text-[#F3EFE6] px-3 py-2 text-xs font-serif border-b-2 border-[#14120E] flex items-start justify-between gap-2 shadow-inner">
          <div className="flex items-start gap-1.5">
            <span className="text-[#E5A93B] font-bold uppercase tracking-wider text-[10px] font-mono shrink-0 mt-0.5">
              Historical Note:
            </span>
            <p className="leading-snug text-[#E0D5C3]">{panel.historicalFactDetail}</p>
          </div>
          <button
            onClick={() => setShowFact(false)}
            className="text-[10px] font-mono text-[#E5A93B] hover:underline shrink-0"
          >
            Close
          </button>
        </div>
      )}

      {/* Panel Canvas Area */}
      <div className="relative flex-1 min-h-[220px] sm:min-h-[260px] flex flex-col justify-between overflow-hidden">
        {/* Layer 1: Art Rendering */}
        <div className="absolute inset-0 z-0">
          <ComicArtRenderer
            customImageUrl={panel.customImageUrl}
            sceneDescription={panel.sceneDescription}
            visualMood={panel.visualMood}
            panelNumber={panel.panelNumber}
            eraTag={eraTag}
          />
        </div>

        {/* Layer 2: Sound Effect Burst (SFX) */}
        {panel.soundEffect && (
          <div className="absolute top-1/3 right-8 z-15">
            <SoundEffectBurst sfx={panel.soundEffect} />
          </div>
        )}

        {/* Layer 3: Speech Balloons (Top & Bottom) */}
        <div className="relative z-20 p-2 sm:p-3 flex flex-col justify-between h-full gap-2 pointer-events-auto">
          {/* Top balloons */}
          <div className="flex flex-col gap-2">
            {panel.dialogueBalloons
              .filter(
                (b) =>
                  !b.position ||
                  b.position === 'top-left' ||
                  b.position === 'top-right'
              )
              .map((b) => (
                <SpeechBubble
                  key={b.id}
                  balloon={b}
                  onUpdateText={(newText) => onUpdateBalloonText(b.id, newText)}
                />
              ))}
          </div>

          {/* Bottom balloons */}
          <div className="flex flex-col gap-2">
            {panel.dialogueBalloons
              .filter(
                (b) =>
                  b.position === 'bottom-left' || b.position === 'bottom-right'
              )
              .map((b) => (
                <SpeechBubble
                  key={b.id}
                  balloon={b}
                  onUpdateText={(newText) => onUpdateBalloonText(b.id, newText)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Ribbon: Panel Stage Cues & Quick Regenerate */}
      <div className="relative z-20 bg-[#FAF5E8] border-t-2 border-[#14120E] px-2.5 py-1 text-[10px] text-[#554A3B] flex items-center justify-between font-mono">
        <span className="truncate max-w-[200px] sm:max-w-xs italic font-serif">
          {panel.sceneDescription}
        </span>
        <button
          onClick={() => onRegeneratePanel(panel.panelNumber)}
          className="flex items-center gap-1 text-[#E26D16] hover:text-[#B84E06] font-bold uppercase transition-colors shrink-0"
          title="Regenerate this panel beat with Gemini"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Remix Beat</span>
        </button>
      </div>
    </div>
  );
};
