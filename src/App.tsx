import React, { useState, useEffect } from 'react';
import { ComicStory, ComicPanel, HistoricalSagaPreset } from './types/comic';
import { HISTORICAL_SAGAS } from './data/historicalPresets';
import { ComicHeader } from './components/ComicHeader';
import { ComicHeroBanner } from './components/ComicHeroBanner';
import { ComicPage } from './components/ComicPage';
import { ComicCreatorModal } from './components/ComicCreatorModal';
import { HistoricalLoreDrawer } from './components/HistoricalLoreDrawer';
import { PanelEditorModal } from './components/PanelEditorModal';
import { ComicScriptViewer } from './components/ComicScriptViewer';
import { MotionComicPlayer } from './components/MotionComicPlayer';
import { Sparkles, Printer, Download, BookOpen, Volume2, History, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentStory, setCurrentStory] = useState<ComicStory>(HISTORICAL_SAGAS[0].sampleStory);
  const [activeSagaId, setActiveSagaId] = useState<string>(HISTORICAL_SAGAS[0].id);

  // Modals & Panels
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [isScriptOpen, setIsScriptOpen] = useState(false);
  const [isMotionModeActive, setIsMotionModeActive] = useState(false);
  const [editingPanel, setEditingPanel] = useState<ComicPanel | null>(null);

  // Generation & Operation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [playingPanelNumber, setPlayingPanelNumber] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio object ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Saga selection
  const handleSelectSaga = (saga: HistoricalSagaPreset) => {
    setActiveSagaId(saga.id);
    setCurrentStory(saga.sampleStory);
    showToast(`Loaded "${saga.title}" (${saga.eraTag})`);
  };

  // Generate new comic with Gemini 3.8 Flash
  const handleGenerateComic = async (params: {
    era: string;
    storyTitle: string;
    protagonist: string;
    toneStyle: string;
    panelCount: number;
    userNotes: string;
  }) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!data.success || !data.comic) {
        throw new Error(data.error || 'Failed to generate comic');
      }

      const generatedComic: ComicStory = {
        ...data.comic,
        id: `gen-${Date.now()}`,
        coverImage: HISTORICAL_SAGAS.find((s) => params.era.includes(s.eraTag))?.coverImage,
      };

      setCurrentStory(generatedComic);
      setActiveSagaId('custom');
      showToast(`Created "${generatedComic.title}" with Gemini 3.8!`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with Gemini');
      showToast('Generation failed, please check connection.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Remix an individual panel
  const handleRegeneratePanel = async (panelNumber: number, feedback?: string) => {
    setIsRemixing(true);
    setPlayingPanelNumber(panelNumber);

    try {
      const response = await fetch('/api/comic/regenerate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comicContext: currentStory,
          panelNumber,
          userFeedback: feedback || 'Make dialogue more intense and dynamic action',
        }),
      });

      const data = await response.json();
      if (data.success && data.panel) {
        const updatedPanels = currentStory.panels.map((p) =>
          p.panelNumber === panelNumber ? { ...p, ...data.panel } : p
        );
        setCurrentStory({ ...currentStory, panels: updatedPanels });
        showToast(`Remixed Panel #${panelNumber} with Gemini!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not remix panel.');
    } finally {
      setIsRemixing(false);
      setPlayingPanelNumber(null);
    }
  };

  // Update speech balloon inline
  const handleUpdateBalloonText = (panelIndex: number, balloonId: string, newText: string) => {
    const updatedPanels = [...currentStory.panels];
    const targetPanel = { ...updatedPanels[panelIndex] };
    targetPanel.dialogueBalloons = targetPanel.dialogueBalloons.map((b) =>
      b.id === balloonId ? { ...b, text: newText } : b
    );
    updatedPanels[panelIndex] = targetPanel;
    setCurrentStory({ ...currentStory, panels: updatedPanels });
    showToast('Dialogue updated.');
  };

  // Save modified panel from editor
  const handleSavePanel = (updatedPanel: ComicPanel) => {
    const updatedPanels = currentStory.panels.map((p) =>
      p.panelNumber === updatedPanel.panelNumber ? updatedPanel : p
    );
    setCurrentStory({ ...currentStory, panels: updatedPanels });
    showToast(`Panel #${updatedPanel.panelNumber} saved!`);
  };

  // Audio Narration with Gemini TTS or Web Speech fallback
  const handlePlayTTS = async (text: string, speaker: string = 'Narrator') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const response = await fetch('/api/comic/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker }),
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        return;
      }
    } catch (err) {
      console.warn('Backend TTS call failed, using Web Speech API fallback', err);
    }

    // Web Speech API fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play narration for single panel
  const handlePlayPanelAudio = (panel: ComicPanel) => {
    setPlayingPanelNumber(panel.panelNumber);
    const speechText = `${panel.captionBox}. ${panel.dialogueBalloons
      .map((b) => `${b.speaker}: ${b.text}`)
      .join(' ')}`;
    handlePlayTTS(speechText, 'Narrator');
    setTimeout(() => {
      setPlayingPanelNumber(null);
    }, 4000);
  };

  // Print or export comic strip
  const handlePrintOrExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#14120E] text-[#F3EFE6] flex flex-col font-sans selection:bg-[#E26D16] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#E5A93B] text-[#14120E] px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] border-2 border-[#14120E] animate-bounce font-mono">
          {toastMessage}
        </div>
      )}

      {/* Header conforming to Top Bar Contract */}
      <ComicHeader
        onOpenCreator={() => setIsCreatorOpen(true)}
        onOpenLore={() => setIsLoreOpen(true)}
        onOpenScript={() => setIsScriptOpen(true)}
        onToggleMotionMode={() => setIsMotionModeActive(!isMotionModeActive)}
        isMotionModeActive={isMotionModeActive}
        onExport={handlePrintOrExport}
        currentIssueTitle={currentStory.title}
      />

      {/* Hero Marquee Section */}
      <ComicHeroBanner
        sagas={HISTORICAL_SAGAS}
        activeSagaId={activeSagaId}
        onSelectSaga={handleSelectSaga}
        onOpenCreator={() => setIsCreatorOpen(true)}
      />

      {/* Main Comic Page Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-6 bg-red-950/80 border-2 border-red-600 p-4 rounded text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-mono uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Comic Strip Utility Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#1C1813] border-2 border-[#2C2418] p-3 rounded">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#E5A93B] font-bold uppercase tracking-wider">
              Active Issue:
            </span>
            <span className="text-[#FDF8EE] font-serif font-semibold">
              {currentStory.title}
            </span>
            <span className="text-[#8C7A65]">({currentStory.eraTag})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoreOpen(true)}
              className="text-xs font-mono text-[#D4C3AA] hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-[#272017] hover:bg-[#342B20] border border-[#3E3224] transition-colors"
            >
              <History className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>Historical Notes</span>
            </button>

            <button
              onClick={() => setIsScriptOpen(true)}
              className="text-xs font-mono text-[#D4C3AA] hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-[#272017] hover:bg-[#342B20] border border-[#3E3224] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>Storyboard Script</span>
            </button>

            <button
              onClick={() => setIsMotionModeActive(true)}
              className="text-xs font-mono text-[#14120E] font-bold flex items-center gap-1 px-3 py-1 rounded bg-[#E5A93B] hover:bg-[#F2B64B] shadow-[2px_2px_0px_#000] transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Motion Reader</span>
            </button>

            <button
              onClick={handlePrintOrExport}
              className="text-xs font-mono text-[#D4C3AA] hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-[#272017] hover:bg-[#342B20] border border-[#3E3224] transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span className="hidden sm:inline">Print Issue</span>
            </button>
          </div>
        </div>

        {/* Master Comic Page */}
        <ComicPage
          story={currentStory}
          onEditPanel={(panel) => setEditingPanel(panel)}
          onRegeneratePanel={(panelNum) => handleRegeneratePanel(panelNum)}
          onPlayPanelAudio={handlePlayPanelAudio}
          onUpdateBalloonText={handleUpdateBalloonText}
          playingPanelNumber={playingPanelNumber}
        />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#241D15] bg-[#120F0C] py-6 px-4 lg:px-8 text-center text-xs font-mono text-[#8C7A65]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-comic text-base text-[#FDF8EE] tracking-wider">
              COMICS CRAFT
            </span>
            <span>—</span>
            <span>Indian Historical Graphic Chronicles</span>
          </div>
          <div className="flex items-center gap-4 text-[#A18F7B]">
            <span>Model: Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Amar Chitra Katha Graphic Tradition</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ComicCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onGenerate={handleGenerateComic}
        isGenerating={isGenerating}
      />

      <HistoricalLoreDrawer
        isOpen={isLoreOpen}
        onClose={() => setIsLoreOpen(false)}
        story={currentStory}
      />

      <PanelEditorModal
        isOpen={Boolean(editingPanel)}
        onClose={() => setEditingPanel(null)}
        panel={editingPanel}
        onSavePanel={handleSavePanel}
        onRegenerateWithPrompt={(panelNum, feedback) =>
          handleRegeneratePanel(panelNum, feedback)
        }
        isRemixing={isRemixing}
      />

      <ComicScriptViewer
        isOpen={isScriptOpen}
        onClose={() => setIsScriptOpen(false)}
        story={currentStory}
      />

      {isMotionModeActive && (
        <MotionComicPlayer
          isOpen={isMotionModeActive}
          onClose={() => setIsMotionModeActive(false)}
          story={currentStory}
          onPlayTTS={handlePlayTTS}
          isAudioPlaying={Boolean(playingPanelNumber)}
        />
      )}
    </div>
  );
}
