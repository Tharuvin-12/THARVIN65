import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Comic Generation Schema definition
const ComicResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Catchy comic book title in classic Indian graphic style' },
    subtitle: { type: Type.STRING, description: 'Dramatic sub-heading e.g. The Battle of Sinhagad 1670' },
    issueNumber: { type: Type.INTEGER, description: 'Comic Issue number e.g. 1, 42, 108' },
    eraTag: { type: Type.STRING, description: 'Historical era name e.g. Maratha Empire, Mauryan Dynasty, 1857 Rebellion' },
    yearPeriod: { type: Type.STRING, description: 'Precise year or era e.g. 1670 CE, 320 BCE, 1857 CE' },
    tagline: { type: Type.STRING, description: 'Classic punchy comic slogan e.g. BLOOD, HONOR & THE SAHYADRI ROCKS!' },
    historicalContext: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: 'Accurate historical summary of the real event' },
        significance: { type: Type.STRING, description: 'Why this event or figure matters in Indian history' },
        sourcesAndChronicles: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Primary sources or chronicles e.g. Sabhasad Bakhar, Arthashastra' },
        primaryLocations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Historical forts, rivers, cities e.g. Sinhagad, Pataliputra' },
      },
      required: ['summary', 'significance', 'sourcesAndChronicles', 'primaryLocations'],
    },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING, description: 'e.g. Subedar of the Maratha Army, Royal Advisor' },
          visualDescription: { type: Type.STRING, description: 'Costume, weapon, facial features, armor for comic artist' },
          historicalNotes: { type: Type.STRING, description: 'Brief historical trivia' },
        },
        required: ['name', 'role', 'visualDescription'],
      },
    },
    panels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          panelNumber: { type: Type.INTEGER },
          layoutSpan: {
            type: Type.STRING,
            description: 'Panel width style: "standard" (1 col), "wide" (2 col cinematic), or "splash" (full width dramatic)',
          },
          captionBox: {
            type: Type.STRING,
            description: 'Narrator caption in classic comic style (all-caps or dramatic prose e.g. "MIDNIGHT AT THE FOOT OF KONDHANA...")',
          },
          sceneDescription: {
            type: Type.STRING,
            description: 'Detailed visual stage direction: camera angle, lighting, background, poses',
          },
          visualMood: {
            type: Type.STRING,
            description: 'Color palette & lighting mood e.g. "Stormy night torchlight with saffron glows"',
          },
          dialogueBalloons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                speaker: { type: Type.STRING },
                text: { type: Type.STRING },
                type: {
                  type: Type.STRING,
                  description: 'Balloon style: "speech", "shout", "thought", or "whisper"',
                },
                position: {
                  type: Type.STRING,
                  description: '"top-left", "top-right", "bottom-left", or "bottom-right"',
                },
              },
              required: ['id', 'speaker', 'text', 'type'],
            },
          },
          soundEffect: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: 'Punchy onomatopoeia e.g. "DHAAAAM!", "TRRRR!", "SHRRRING!", "KHADAK!"' },
              style: { type: Type.STRING, description: '"explosive", "blade", "thunder", "rumble"' },
            },
          },
          historicalFactDetail: {
            type: Type.STRING,
            description: 'Specific authentic historical footnote for this panel (e.g. details of weapon, tactical maneuver, or battle cry)',
          },
        },
        required: ['panelNumber', 'layoutSpan', 'captionBox', 'sceneDescription', 'visualMood', 'dialogueBalloons'],
      },
    },
  },
  required: ['title', 'subtitle', 'issueNumber', 'eraTag', 'yearPeriod', 'tagline', 'historicalContext', 'characters', 'panels'],
};

// POST /api/comic/generate: Generate an Indian Historical Comic Story
app.post('/api/comic/generate', async (req, res) => {
  try {
    const {
      era = 'Maratha Empire',
      storyTitle = '',
      protagonist = '',
      toneStyle = 'Classic Amar Chitra Katha',
      panelCount = 6,
      userNotes = '',
    } = req.body;

    const systemInstruction = `You are the master comic writer, visual storyboard director, and Indian history scholar for "COMICS CRAFT".
Your mission is to script an authentic, gripping, visually dramatic Indian historical comic strip/issue in the style of classic Indian graphic storytelling (like Amar Chitra Katha, Chandamama, Indrajal Comics, and grand Indian historical graphic novels).

CORE RULES FOR INDIAN HISTORICAL COMICS:
1. RESPECT & ACCURACY: Ground events in authentic Indian historical records (e.g., Marathas under Shivaji, Mauryan statecraft under Chanakya & Ashoka, Rani Lakshmibai of Jhansi, Vijayanagara Empire, Rajput resistance, Chola naval expeditions). Highlight real fortresses, weapons (Talwar, Dandpatta, Firangi, Bow/Khanda), tactics, and historical quotes.
2. COMIC BOOK SCRIPTING CADENCE:
   - Panel Captions must feel like vintage comic boxes: "AS THE FIRST RAYS OF SUN SHINE UPON FORT RAIGAD...", "IN THE MARBLED COURTS OF PATALIPUTRA, CHANAKYA SMILES..."
   - Dialogue must be punchy, heroic, dramatic, and natural for comic speech balloons. Keep individual balloons between 5 to 20 words so they fit inside visual speech bubbles.
   - Dialogue types: use "shout" for battle cries (e.g., "HAR HAR MAHADEV!", "MERI JHANSI NAHI DOONGI!"), "whisper" for secret conspiracies, "thought" for inner monologues.
   - Include authentic sound effects (SFX) on action panels: "DHAAAM!", "TRRR!", "SHRRRING!", "KHADAK!", "SWOOOSH!".
   - Provide exactly ${panelCount} panels. Alternate between 1-column standard panels and 2-column wide cinematic/splash panels for visual rhythm.
3. HISTORICAL ACCURACY FOOTNOTES: For each panel, provide a factual footnote detailing the real military tactic, armor, weapon, or primary source citation.`;

    const prompt = `Create a ${panelCount}-panel Indian historical comic issue.
Parameters:
- Era: ${era}
- Story/Focus: ${storyTitle || 'Major historical turning point or heroic exploit of this era'}
- Protagonist/Main Figures: ${protagonist || 'Key historical rulers or commanders'}
- Visual & Story Tone: ${toneStyle}
- Custom Directions & Plot Beats: ${userNotes || 'Make it heroic, historically vivid, dramatic, and visually compelling with grand battles, statecraft, or fortress sieges.'}

Return the complete comic script strictly according to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: ComicResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No content returned from Gemini model');
    }

    const comicData = JSON.parse(text);
    res.json({ success: true, comic: comicData });
  } catch (error: any) {
    console.error('Error generating comic:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate historical comic script',
    });
  }
});

// POST /api/comic/regenerate-panel: Re-script or enhance an individual panel
app.post('/api/comic/regenerate-panel', async (req, res) => {
  try {
    const { comicContext, panelNumber, userFeedback } = req.body;

    const prompt = `We have an existing Indian historical comic titled "${comicContext?.title}" (${comicContext?.eraTag}).
We need to regenerate Panel #${panelNumber}.
User instruction for this panel: "${userFeedback || 'Make it more dramatic, enhance dialogue and visual action'}".

Current comic synopsis: ${comicContext?.tagline}
Characters involved: ${JSON.stringify(comicContext?.characters || [])}

Return a single JSON object for this panel with:
{
  "panelNumber": ${panelNumber},
  "layoutSpan": "standard" or "wide",
  "captionBox": "...",
  "sceneDescription": "...",
  "visualMood": "...",
  "dialogueBalloons": [{"id": "b1", "speaker": "...", "text": "...", "type": "speech"|"shout"|"thought", "position": "top-left"|"top-right"}],
  "soundEffect": {"text": "...", "style": "..."},
  "historicalFactDetail": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an Indian historical comic scriptwriter. Output strictly valid JSON for a single panel object.',
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    const panelData = JSON.parse(text);

    res.json({ success: true, panel: panelData });
  } catch (error: any) {
    console.error('Error regenerating panel:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to regenerate panel' });
  }
});

// POST /api/comic/tts: Voice narration for comic panels using gemini-3.8-flash-lite-tts
app.post('/api/comic/tts', async (req, res) => {
  try {
    const { text, speaker = 'Narrator', voice = 'Kore' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const narrationScript = `${speaker === 'Narrator' ? '' : `${speaker}: `}${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: narrationScript,
              speechMetadata: {
                style: 'Dramatic, resonant storyteller recounting an epic Indian historical legend',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'TTS did not return audio data' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({ success: false, error: error.message || 'TTS generation failed' });
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Comics Craft] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
