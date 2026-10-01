import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Printer } from 'lucide-react';
import { ComicStory } from '../types/comic';

interface ComicScriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  story: ComicStory;
}

export const ComicScriptViewer: React.FC<ComicScriptViewerProps> = ({
  isOpen,
  onClose,
  story,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format script into standard comic script format
  const generateScriptText = () => {
    let script = `COMICS CRAFT — HISTORICAL COMIC SCRIPT\n`;
    script += `TITLE: ${story.title}\n`;
    script += `SUBTITLE: ${story.subtitle}\n`;
    script += `ERA: ${story.eraTag} (${story.yearPeriod})\n`;
    script += `ISSUE: #${story.issueNumber}\n`;
    script += `TAGLINE: ${story.tagline}\n`;
    script += `===========================================================\n`;
    script += `HISTORICAL CONTEXT:\n${story.historicalContext.summary}\n`;
    script += `PRIMARY SOURCES: ${story.historicalContext.sourcesAndChronicles.join(', ')}\n`;
    script += `===========================================================\n`;
    script += `CHARACTERS:\n`;
    story.characters.forEach((char) => {
      script += `- ${char.name} (${char.role}): ${char.visualDescription}\n`;
    });
    script += `===========================================================\n\n`;

    story.panels.forEach((p) => {
      script += `[PANEL ${p.panelNumber}] (${p.layoutSpan.toUpperCase()} LAYOUT)\n`;
      script += `CAPTION: ${p.captionBox}\n`;
      script += `VISUAL DIRECTION: ${p.sceneDescription}\n`;
      script += `LIGHTING/MOOD: ${p.visualMood}\n`;
      if (p.soundEffect?.text) {
        script += `SFX: ${p.soundEffect.text} (${p.soundEffect.style})\n`;
      }
      script += `DIALOGUE:\n`;
      p.dialogueBalloons.forEach((b) => {
        script += `   ${b.speaker.toUpperCase()} (${b.type.toUpperCase()}): "${b.text}"\n`;
      });
      if (p.historicalFactDetail) {
        script += `HISTORICAL NOTE: ${p.historicalFactDetail}\n`;
      }
      script += `\n-----------------------------------------------------------\n\n`;
    });

    return script;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateScriptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateScriptText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#181410] text-[#F3EFE6] border-4 border-[#3A2E1E] rounded-md shadow-2xl p-6 my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2F2518] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E5A93B]" />
            <div>
              <h3 className="font-comic text-2xl text-[#FDF8EE] uppercase tracking-wide">
                Comic Storyboard Script
              </h3>
              <p className="text-xs font-mono text-[#8C7A65]">
                {story.title} · Issue #{story.issueNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#251D15] hover:bg-[#34291D] border border-[#3E3022] text-[#E5A93B] px-3 py-1.5 rounded text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Script'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-[#E26D16] hover:bg-[#F27822] text-[#14120E] px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={onClose}
              className="text-[#96836C] hover:text-white p-1 rounded transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Script Content Viewer (Monospace script formatting) */}
        <div className="flex-1 overflow-y-auto bg-[#100D0A] p-4 rounded border border-[#2D2316] font-mono text-xs text-[#D8C7AF] leading-relaxed selection:bg-[#E26D16] selection:text-white">
          <div className="text-[#E5A93B] font-bold text-sm mb-1">{story.title}</div>
          <div className="text-[#9C8974] mb-3">{story.subtitle}</div>
          <div className="text-[#E26D16] text-[11px] mb-4">
            {story.eraTag} · {story.yearPeriod} · Tagline: "{story.tagline}"
          </div>

          <div className="border-b border-[#2A2014] pb-4 mb-4">
            <div className="text-[#E5A93B] font-bold uppercase text-[10px] mb-1">
              HISTORICAL CONTEXT:
            </div>
            <p className="text-[#C4B298] font-serif mb-2">{story.historicalContext.summary}</p>
            <div className="text-[10px] text-[#8C7A65]">
              SOURCES: {story.historicalContext.sourcesAndChronicles.join(' · ')}
            </div>
          </div>

          <div className="border-b border-[#2A2014] pb-4 mb-4">
            <div className="text-[#E5A93B] font-bold uppercase text-[10px] mb-1">
              CAST OF CHARACTERS:
            </div>
            {story.characters.map((c, i) => (
              <div key={i} className="mb-1 text-xs">
                <span className="text-[#FDF8EE] font-bold">{c.name}</span> ({c.role}):{' '}
                <span className="text-[#A18F7B] italic">{c.visualDescription}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {story.panels.map((p) => (
              <div key={p.panelNumber} className="border-l-2 border-[#E26D16] pl-3 py-1">
                <div className="text-[#E5A93B] font-bold uppercase text-xs">
                  [PANEL {p.panelNumber}] — {p.layoutSpan.toUpperCase()}
                </div>
                <div className="text-[#FEE028] font-bold text-[11px] my-1">
                  CAPTION: "{p.captionBox}"
                </div>
                <div className="text-[#A69580] italic text-xs mb-1">
                  ACTION: {p.sceneDescription}
                </div>
                <div className="text-[10px] text-[#7A6955] mb-2">
                  LIGHTING: {p.visualMood}
                </div>

                {p.soundEffect?.text && (
                  <div className="text-[#E26D16] font-bold text-xs mb-2">
                    SFX: {p.soundEffect.text} ({p.soundEffect.style})
                  </div>
                )}

                <div className="space-y-1 my-2 bg-[#17130F] p-2 rounded">
                  <div className="text-[10px] text-[#8C7A65] uppercase font-bold">DIALOGUE:</div>
                  {p.dialogueBalloons.map((b) => (
                    <div key={b.id} className="text-xs pl-2">
                      <span className="text-[#FDF8EE] font-bold">{b.speaker}</span>{' '}
                      <span className="text-[10px] text-[#E5A93B]">({b.type})</span>:{' '}
                      <span className="text-[#E2D5C3]">"{b.text}"</span>
                    </div>
                  ))}
                </div>

                {p.historicalFactDetail && (
                  <div className="text-[10px] text-[#8C7A65] mt-1">
                    * HISTORICAL FOOTNOTE: {p.historicalFactDetail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
