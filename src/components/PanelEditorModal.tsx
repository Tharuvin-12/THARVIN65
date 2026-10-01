import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Volume2, Save } from 'lucide-react';
import { ComicPanel, DialogueBalloon, DialogueType, BubblePosition } from '../types/comic';

interface PanelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  panel: ComicPanel | null;
  onSavePanel: (updatedPanel: ComicPanel) => void;
  onRegenerateWithPrompt: (panelNumber: number, feedback: string) => Promise<void>;
  isRemixing: boolean;
}

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  isOpen,
  onClose,
  panel,
  onSavePanel,
  onRegenerateWithPrompt,
  isRemixing,
}) => {
  if (!isOpen || !panel) return null;

  const [captionBox, setCaptionBox] = useState(panel.captionBox);
  const [sceneDescription, setSceneDescription] = useState(panel.sceneDescription);
  const [visualMood, setVisualMood] = useState(panel.visualMood);
  const [layoutSpan, setLayoutSpan] = useState(panel.layoutSpan);
  const [dialogueBalloons, setDialogueBalloons] = useState<DialogueBalloon[]>(
    panel.dialogueBalloons || []
  );
  const [sfxText, setSfxText] = useState(panel.soundEffect?.text || '');
  const [sfxStyle, setSfxStyle] = useState(panel.soundEffect?.style || 'explosive');
  const [remixPrompt, setRemixPrompt] = useState('');

  const handleAddBalloon = () => {
    const newBalloon: DialogueBalloon = {
      id: `b-${Date.now()}`,
      speaker: 'Hero',
      text: 'New dialogue line...',
      type: 'speech',
      position: 'top-left',
    };
    setDialogueBalloons([...dialogueBalloons, newBalloon]);
  };

  const handleUpdateBalloon = (
    index: number,
    field: keyof DialogueBalloon,
    value: any
  ) => {
    const updated = [...dialogueBalloons];
    updated[index] = { ...updated[index], [field]: value };
    setDialogueBalloons(updated);
  };

  const handleRemoveBalloon = (index: number) => {
    setDialogueBalloons(dialogueBalloons.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedPanel: ComicPanel = {
      ...panel,
      captionBox,
      sceneDescription,
      visualMood,
      layoutSpan,
      dialogueBalloons,
      soundEffect: sfxText.trim()
        ? { text: sfxText.trim(), style: sfxStyle as any }
        : undefined,
    };
    onSavePanel(updatedPanel);
    onClose();
  };

  const handleRemix = async () => {
    if (!remixPrompt.trim()) return;
    await onRegenerateWithPrompt(panel.panelNumber, remixPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1C1813] text-[#F3EFE6] border-4 border-[#2F261B] rounded-md p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2F261B] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#E26D16] text-[#14120E] font-black text-xs px-2 py-0.5 rounded font-mono">
              PANEL #{panel.panelNumber}
            </span>
            <h3 className="font-comic text-2xl text-[#FDF8EE] uppercase tracking-wide">
              Edit Comic Beat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#96836C] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Caption Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-1 font-mono">
              Caption Box (Vintage Yellow Box)
            </label>
            <input
              type="text"
              value={captionBox}
              onChange={(e) => setCaptionBox(e.target.value)}
              className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs font-mono font-bold text-[#FEE028] focus:outline-none focus:border-[#E5A93B]"
            />
          </div>

          {/* Panel Layout Span */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                Panel Width Style
              </label>
              <select
                value={layoutSpan}
                onChange={(e) => setLayoutSpan(e.target.value as any)}
                className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
              >
                <option value="standard">Standard (1 Column)</option>
                <option value="wide">Wide Cinematic (2 Columns)</option>
                <option value="splash">Splash Hero (3 Columns)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                Visual Lighting / Mood
              </label>
              <input
                type="text"
                value={visualMood}
                onChange={(e) => setVisualMood(e.target.value)}
                placeholder="e.g. Midnight torchlight, Dawn rays..."
                className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
              />
            </div>
          </div>

          {/* Scene Direction Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
              Scene Illustration Description
            </label>
            <textarea
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
            />
          </div>

          {/* Speech Balloons Manager */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#E5A93B] font-mono">
                Dialogue Balloons ({dialogueBalloons.length})
              </label>
              <button
                type="button"
                onClick={handleAddBalloon}
                className="text-xs font-bold text-[#E26D16] hover:text-[#FFA04D] flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Balloon</span>
              </button>
            </div>

            <div className="space-y-2">
              {dialogueBalloons.map((b, idx) => (
                <div
                  key={b.id || idx}
                  className="bg-[#14110D] p-2.5 rounded border border-[#2F2518] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={b.speaker}
                        onChange={(e) =>
                          handleUpdateBalloon(idx, 'speaker', e.target.value)
                        }
                        placeholder="Speaker Name"
                        className="bg-[#241D15] border border-[#3D3021] text-[#E5A93B] font-bold text-xs px-2 py-1 rounded w-32 focus:outline-none"
                      />
                      <select
                        value={b.type}
                        onChange={(e) =>
                          handleUpdateBalloon(
                            idx,
                            'type',
                            e.target.value as DialogueType
                          )
                        }
                        className="bg-[#241D15] border border-[#3D3021] text-xs px-2 py-1 rounded text-[#F3EFE6]"
                      >
                        <option value="speech">Speech</option>
                        <option value="shout">Shout (Jagged)</option>
                        <option value="thought">Thought (Cloud)</option>
                        <option value="whisper">Whisper</option>
                      </select>
                      <select
                        value={b.position || 'top-left'}
                        onChange={(e) =>
                          handleUpdateBalloon(
                            idx,
                            'position',
                            e.target.value as BubblePosition
                          )
                        }
                        className="bg-[#241D15] border border-[#3D3021] text-xs px-2 py-1 rounded text-[#C4B298]"
                      >
                        <option value="top-left">Top-Left</option>
                        <option value="top-right">Top-Right</option>
                        <option value="bottom-left">Bottom-Left</option>
                        <option value="bottom-right">Bottom-Right</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBalloon(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    value={b.text}
                    onChange={(e) =>
                      handleUpdateBalloon(idx, 'text', e.target.value)
                    }
                    placeholder="Dialogue text..."
                    rows={2}
                    className="w-full bg-[#181410] border border-[#3D3021] text-xs p-1.5 rounded focus:outline-none text-[#FDF8EE]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sound Effect (SFX) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                Sound Effect (SFX)
              </label>
              <input
                type="text"
                value={sfxText}
                onChange={(e) => setSfxText(e.target.value)}
                placeholder="e.g. DHAAAAM!, TRRR!, SHINGG!"
                className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs font-comic text-[#FEE028] text-base focus:outline-none focus:border-[#E5A93B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                SFX Visual Style
              </label>
              <select
                value={sfxStyle}
                onChange={(e) => setSfxStyle(e.target.value as any)}
                className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
              >
                <option value="explosive">Explosive Starburst</option>
                <option value="blade">Blade Clash Lines</option>
                <option value="thunder">Thunder Bolt</option>
                <option value="rumble">Rumble Vibration</option>
              </select>
            </div>
          </div>

          {/* AI Remix Beat with Gemini */}
          <div className="bg-[#241C14] p-3 rounded border border-[#3D3021]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-1 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remix this Panel with Gemini 3.8</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={remixPrompt}
                onChange={(e) => setRemixPrompt(e.target.value)}
                placeholder="e.g. Make dialogue more intense, emphasize sword clash..."
                className="flex-1 bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
              />
              <button
                type="button"
                onClick={handleRemix}
                disabled={isRemixing || !remixPrompt.trim()}
                className="bg-[#E26D16] hover:bg-[#F27822] disabled:opacity-50 text-[#14120E] px-4 py-2 rounded text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Remix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#2F261B] mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-mono font-bold text-[#A89880] hover:bg-[#262018]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#E5A93B] hover:bg-[#F2B64B] text-[#14120E] px-5 py-2 rounded font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Panel Beat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
