import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { ComicStory, ComicPanel } from '../types/comic';
import { ComicArtRenderer } from './ComicArtRenderer';
import { SpeechBubble } from './SpeechBubble';
import { SoundEffectBurst } from './SoundEffectBurst';

interface MotionComicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  story: ComicStory;
  onPlayTTS: (text: string, speaker?: string) => Promise<void>;
  isAudioPlaying: boolean;
}

export const MotionComicPlayer: React.FC<MotionComicPlayerProps> = ({
  isOpen,
  onClose,
  story,
  onPlayTTS,
  isAudioPlaying,
}) => {
  if (!isOpen) return null;

  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const panel = story.panels[currentPanelIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAuto && !isAudioPlaying) {
      timer = setTimeout(() => {
        if (currentPanelIndex < story.panels.length - 1) {
          handleNext();
        } else {
          setIsPlayingAuto(false);
        }
      }, 5500);
    }
    return () => clearTimeout(timer);
  }, [isPlayingAuto, isAudioPlaying, currentPanelIndex, story.panels.length]);

  const handleNext = () => {
    if (currentPanelIndex < story.panels.length - 1) {
      const nextIdx = currentPanelIndex + 1;
      setCurrentPanelIndex(nextIdx);
      playCurrentPanelNarration(story.panels[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentPanelIndex > 0) {
      const prevIdx = currentPanelIndex - 1;
      setCurrentPanelIndex(prevIdx);
      playCurrentPanelNarration(story.panels[prevIdx]);
    }
  };

  const playCurrentPanelNarration = (targetPanel: ComicPanel) => {
    const textToRead = `${targetPanel.captionBox}. ${targetPanel.dialogueBalloons
      .map((b) => `${b.speaker} says: ${b.text}`)
      .join(' ')}`;
    onPlayTTS(textToRead, 'Narrator');
  };

  const toggleAutoPlay = () => {
    if (!isPlayingAuto) {
      setIsPlayingAuto(true);
      playCurrentPanelNarration(panel);
    } else {
      setIsPlayingAuto(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-8">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-[#302518] pb-3 text-[#F3EFE6]">
        <div className="flex items-center gap-3">
          <span className="font-comic text-xl text-[#E5A93B] uppercase tracking-wide">
            {story.title}
          </span>
          <span className="text-xs font-mono text-[#8C7A65] border-l border-[#302518] pl-3">
            Panel {currentPanelIndex + 1} of {story.panels.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playCurrentPanelNarration(panel)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#221A12] hover:bg-[#32261A] text-xs font-mono text-[#E5A93B] transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Aloud</span>
          </button>

          <button
            onClick={onClose}
            className="text-[#9C8974] hover:text-white p-1 rounded transition-colors ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Motion Panel Stage */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        <div className="relative w-full max-w-4xl max-h-[75vh] aspect-[16/10] bg-[#FAF5E8] text-[#14120E] border-4 sm:border-8 border-[#14120E] shadow-[0_0_50px_rgba(226,109,22,0.25)] rounded-xs overflow-hidden flex flex-col justify-between">
          {/* Caption Box */}
          <div className="relative z-30 comic-caption-box px-4 py-2 border-b-2 border-[#14120E] flex items-center justify-between">
            <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#14120E]">
              {panel.captionBox}
            </p>
            <span className="bg-[#14120E] text-white font-mono text-xs px-2 py-0.5 rounded font-black">
              #{panel.panelNumber}
            </span>
          </div>

          {/* Canvas & Art Area */}
          <div className="relative flex-1 overflow-hidden">
            <ComicArtRenderer
              customImageUrl={panel.customImageUrl}
              sceneDescription={panel.sceneDescription}
              visualMood={panel.visualMood}
              panelNumber={panel.panelNumber}
              eraTag={story.eraTag}
            />

            {/* Sound effect burst */}
            {panel.soundEffect && (
              <div className="absolute top-1/3 right-12 z-25">
                <SoundEffectBurst sfx={panel.soundEffect} />
              </div>
            )}

            {/* Speech Balloons */}
            <div className="absolute inset-0 z-30 p-4 flex flex-col justify-between pointer-events-none">
              <div className="flex flex-col gap-2">
                {panel.dialogueBalloons
                  .filter(
                    (b) =>
                      !b.position ||
                      b.position === 'top-left' ||
                      b.position === 'top-right'
                  )
                  .map((b) => (
                    <div key={b.id} className="pointer-events-auto">
                      <SpeechBubble balloon={b} isEditable={false} />
                    </div>
                  ))}
              </div>

              <div className="flex flex-col gap-2">
                {panel.dialogueBalloons
                  .filter(
                    (b) =>
                      b.position === 'bottom-left' ||
                      b.position === 'bottom-right'
                  )
                  .map((b) => (
                    <div key={b.id} className="pointer-events-auto">
                      <SpeechBubble balloon={b} isEditable={false} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Historical Fact footnote bar */}
          {panel.historicalFactDetail && (
            <div className="relative z-30 bg-[#292015] text-[#F3EFE6] px-4 py-1.5 text-xs font-serif border-t-2 border-[#14120E] flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#E5A93B] shrink-0" />
              <span className="truncate">{panel.historicalFactDetail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Playback Navigation Bar */}
      <div className="flex items-center justify-between max-w-xl mx-auto w-full pt-2">
        <button
          onClick={handlePrev}
          disabled={currentPanelIndex === 0}
          className="p-2 rounded bg-[#201811] hover:bg-[#302419] disabled:opacity-30 text-[#E5A93B] transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-2 bg-[#E26D16] hover:bg-[#F27822] text-[#14120E] font-comic uppercase text-base px-6 py-2.5 rounded shadow-[3px_3px_0px_#000] transition-all"
          >
            {isPlayingAuto ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlayingAuto ? 'Pause Motion Story' : 'Play Motion Story'}</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPanelIndex === story.panels.length - 1}
          className="p-2 rounded bg-[#201811] hover:bg-[#302419] disabled:opacity-30 text-[#E5A93B] transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
