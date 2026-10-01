export type DialogueType = 'speech' | 'shout' | 'thought' | 'whisper';
export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DialogueBalloon {
  id: string;
  speaker: string;
  text: string;
  type: DialogueType;
  position?: BubblePosition;
}

export interface SoundEffect {
  text: string;
  style?: 'explosive' | 'blade' | 'thunder' | 'rumble';
  color?: string;
}

export interface ComicPanel {
  panelNumber: number;
  layoutSpan: 'standard' | 'wide' | 'splash';
  captionBox: string;
  sceneDescription: string;
  visualMood: string;
  dialogueBalloons: DialogueBalloon[];
  soundEffect?: SoundEffect;
  historicalFactDetail?: string;
  customImageUrl?: string;
  customCanvasSeed?: string;
}

export interface CharacterProfile {
  name: string;
  role: string;
  visualDescription: string;
  historicalNotes?: string;
  avatarUrl?: string;
}

export interface HistoricalContext {
  summary: string;
  significance: string;
  sourcesAndChronicles: string[];
  primaryLocations: string[];
}

export interface ComicStory {
  id: string;
  title: string;
  subtitle: string;
  issueNumber: number;
  eraTag: string;
  yearPeriod: string;
  tagline: string;
  historicalContext: HistoricalContext;
  characters: CharacterProfile[];
  panels: ComicPanel[];
  coverImage?: string;
  styleTheme?: string;
  createdAt?: string;
}

export interface HistoricalSagaPreset {
  id: string;
  title: string;
  eraTag: string;
  yearPeriod: string;
  protagonists: string;
  shortDesc: string;
  coverImage: string;
  defaultPrompt: {
    era: string;
    storyTitle: string;
    protagonist: string;
    toneStyle: string;
    userNotes: string;
  };
  sampleStory: ComicStory;
}
