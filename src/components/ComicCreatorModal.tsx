import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Shield, Sword, ScrollText, Flame, Loader2 } from 'lucide-react';

interface ComicCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    era: string;
    storyTitle: string;
    protagonist: string;
    toneStyle: string;
    panelCount: number;
    userNotes: string;
  }) => Promise<void>;
  isGenerating: boolean;
}

const HISTORICAL_ERA_OPTIONS = [
  {
    id: 'maratha',
    name: 'Maratha Empire (1674 CE)',
    protagonist: 'Chhatrapati Shivaji Maharaj & Tanaji Malusare',
    defaultStory: 'The Midnight Conquest of Kondhana Fort',
    icon: Shield,
    color: 'border-[#E26D16]',
  },
  {
    id: 'jhansi',
    name: '1857 War of Independence',
    protagonist: 'Rani Lakshmibai of Jhansi',
    defaultStory: 'Defiance of the Annexation & Leap from the Ramparts',
    icon: Sword,
    color: 'border-[#DC2626]',
  },
  {
    id: 'maurya',
    name: 'Mauryan Empire (320–232 BCE)',
    protagonist: 'Emperor Ashoka the Great & Chanakya',
    defaultStory: 'From Kalinga Battle to the Rock Edicts of Dhamma',
    icon: ScrollText,
    color: 'border-[#D97706]',
  },
  {
    id: 'vijayanagara',
    name: 'Vijayanagara Empire (1515 CE)',
    protagonist: 'Sri Krishna Deva Raya & Tenali Rama',
    defaultStory: 'The Golden City of Hampi & Defense of the Deccan',
    icon: BookOpen,
    color: 'border-[#B45309]',
  },
  {
    id: 'rajput',
    name: 'Rajputana Valor (1576 CE)',
    protagonist: 'Maharana Pratap of Mewar & Chetak',
    defaultStory: 'The Battle of Haldighati & the Loyalty of Chetak',
    icon: Flame,
    color: 'border-[#EA580C]',
  },
  {
    id: 'chola',
    name: 'Chola Maritime Empire (1025 CE)',
    protagonist: 'Rajendra Chola I',
    defaultStory: 'The Great Naval Armada Across the Bay of Bengal',
    icon: Shield,
    color: 'border-[#0284C7]',
  },
  {
    id: 'custom',
    name: 'Custom Indian Historical Era',
    protagonist: '',
    defaultStory: '',
    icon: Sparkles,
    color: 'border-[#A855F7]',
  },
];

const TONE_OPTIONS = [
  'Classic Amar Chitra Katha (Inked & Halftones)',
  'Dramatic Graphic Novel (Cinematic Noir & Deep Inks)',
  'Vintage Pulp Comic (Distressed Paper & Ben-Day Dots)',
  'Indian Epic Miniature Fusion (Ornate & Mythic)',
];

export const ComicCreatorModal: React.FC<ComicCreatorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}) => {
  const [selectedEra, setSelectedEra] = useState(HISTORICAL_ERA_OPTIONS[0]);
  const [storyTitle, setStoryTitle] = useState(HISTORICAL_ERA_OPTIONS[0].defaultStory);
  const [protagonist, setProtagonist] = useState(HISTORICAL_ERA_OPTIONS[0].protagonist);
  const [toneStyle, setToneStyle] = useState(TONE_OPTIONS[0]);
  const [panelCount, setPanelCount] = useState<number>(6);
  const [userNotes, setUserNotes] = useState('');
  const [generationStep, setGenerationStep] = useState(0);

  if (!isOpen) return null;

  const handleEraSelect = (era: (typeof HISTORICAL_ERA_OPTIONS)[0]) => {
    setSelectedEra(era);
    if (era.id !== 'custom') {
      setStoryTitle(era.defaultStory);
      setProtagonist(era.protagonist);
    } else {
      setStoryTitle('');
      setProtagonist('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fake progress simulation while awaiting server response
    const interval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      await onGenerate({
        era: selectedEra.name,
        storyTitle,
        protagonist,
        toneStyle,
        panelCount,
        userNotes,
      });
      clearInterval(interval);
      setGenerationStep(0);
      onClose();
    } catch (err) {
      clearInterval(interval);
      setGenerationStep(0);
    }
  };

  const steps = [
    'Analyzing Indian historical chronicles & primary records...',
    'Scripting dramatic panel beats, captions & camera angles...',
    'Writing authentic dialogue bubbles & onomatopoeia sound bursts...',
    'Inking panel composition and verifying historical facts...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1C1813] text-[#F3EFE6] border-4 border-[#2F261B] rounded-md shadow-[12px_12px_0px_#000] p-6 overflow-hidden my-8">
        {/* Halftone subtle background */}
        <div className="absolute inset-0 comic-halftone opacity-5 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-4 right-4 text-[#A89880] hover:text-[#FFF] p-1.5 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b-2 border-[#2F261B] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E5A93B] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash Storyboard Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-comic text-[#FBF6EC] tracking-wide uppercase">
            Create Indian Historical Comic
          </h2>
          <p className="text-xs text-[#B5A58E] font-serif mt-1">
            Configure the era, historical figures, and dramatic conflict. Gemini will author a verified, multi-panel retro comic strip.
          </p>
        </div>

        {/* Loading Overlay when generating */}
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#3D3121] border-t-[#E26D16] animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#E5A93B]" />
              </div>
            </div>
            <h3 className="font-comic text-2xl text-[#E5A93B] tracking-wider uppercase mb-2">
              Inking The Chronicles...
            </h3>
            <p className="text-sm font-serif text-[#D4C3A9] max-w-md animate-pulse">
              {steps[generationStep]}
            </p>
            <div className="w-full max-w-xs bg-[#2B2317] h-2 rounded-full overflow-hidden mt-6 border border-[#3D3221]">
              <div
                className="bg-gradient-to-r from-[#E26D16] to-[#E5A93B] h-full transition-all duration-700"
                style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Era Selection Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E5A93B] mb-2 font-mono">
                1. Select Indian Historical Era / Saga
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HISTORICAL_ERA_OPTIONS.map((era) => {
                  const Icon = era.icon;
                  const isSelected = selectedEra.id === era.id;
                  return (
                    <button
                      key={era.id}
                      type="button"
                      onClick={() => handleEraSelect(era)}
                      className={`p-2.5 rounded text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#2E2417] border-[#E5A93B] text-[#FFF] shadow-[2px_2px_0px_#000]'
                          : 'bg-[#15120E] border-[#2C2418] text-[#B8A78F] hover:bg-[#201B14]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3.5 h-3.5 text-[#E26D16] shrink-0" />
                        <span className="text-xs font-bold font-serif line-clamp-1">
                          {era.name.split(' (')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8C7A65] font-mono line-clamp-1">
                        {era.protagonist.split(' & ')[0] || 'Custom'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Era Name (if custom selected) */}
            {selectedEra.id === 'custom' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                  Custom Era / Kingdom Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gupta Golden Age (400 CE), Battle of Plassey, Kakatiya Dynasty..."
                  value={selectedEra.name === 'Custom Indian Historical Era' ? '' : selectedEra.name}
                  onChange={(e) =>
                    setSelectedEra({ ...selectedEra, name: e.target.value })
                  }
                  className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>
            )}

            {/* Story Title & Protagonists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                  Story Title / Turning Point
                </label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="e.g. The Siege of Sinhagad, The Edict of Sarnath..."
                  className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                  Key Historical Figures
                </label>
                <input
                  type="text"
                  required
                  value={protagonist}
                  onChange={(e) => setProtagonist(e.target.value)}
                  placeholder="e.g. Chhatrapati Shivaji, Rani Lakshmibai, Ashoka..."
                  className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>
            </div>

            {/* Panel Count & Visual Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                  Strip Length
                </label>
                <div className="flex gap-2">
                  {[4, 6, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPanelCount(count)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded border transition-colors ${
                        panelCount === count
                          ? 'bg-[#E5A93B] text-[#14120E] border-[#E5A93B]'
                          : 'bg-[#15120E] text-[#B8A78F] border-[#3C3224] hover:bg-[#201B14]'
                      }`}
                    >
                      {count} Panels
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                  Visual Comic Style
                </label>
                <select
                  value={toneStyle}
                  onChange={(e) => setToneStyle(e.target.value)}
                  className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
                >
                  {TONE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Directions & Plot Beats */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4B299] mb-1 font-mono">
                Custom Plot Beats or Historical Details (Optional)
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Include Tanaji's broken shield duel, or show Upagupta teaching ahimsa under the banyan tree..."
                className="w-full bg-[#120F0C] border border-[#3C3224] rounded px-3 py-2 text-xs text-[#F3EFE6] focus:outline-none focus:border-[#E5A93B]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#E26D16] hover:bg-[#F27822] text-[#14120E] py-3 rounded font-comic text-lg uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-[#14120E]" />
                <span>Script & Illustrate Comic Strip</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
