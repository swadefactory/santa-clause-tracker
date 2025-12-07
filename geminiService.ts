import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Note } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper for TTS Audio Decoding ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Main Service Functions ---

/**
 * Generates a custom Santa avatar based on user description.
 */
export const generateSantaAvatar = async (style: string): Promise<string | null> => {
  try {
    const description = `A warm, friendly, magical portrait of a ${style} Santa Claus. Digital art style, soft lighting, detailed texture, festive background, wearing traditional red suit. Aspect ratio 1:1.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: description,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Santa Image Generation Error:", error);
    return null;
  }
};

/**
 * Main chat function with Santa.
 * Incorporates behavior notes into the system instruction for grounding.
 * Adapts persona based on the selected Santa style.
 */
export const chatWithSanta = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string,
  notes: Note[],
  style: string = 'Classic'
): Promise<string> => {
  const behaviorSummary = notes
    .map(n => `[${n.type} by ${n.author}]: ${n.content}`)
    .join('\n');

  // Persona Definition based on Style
  let persona = "You are the traditional Santa Claus. Speak with a 'Ho ho ho' and a jolly, old-timey Christmas spirit.";
  
  switch (style) {
    case 'African American':
      persona = "You are a warm, soulful African American Santa. Speak with a rich, comforting voice. Use language that feels familiar, supportive, and community-focused.";
      break;
    case 'Asian':
      persona = "You are a wise, gentle Asian Santa. Speak with a calm, polite, and respectful tone. Reflect a subtle Asian-English cadence (clear, perhaps slightly formal or staccato in a dignified way). Focus on harmony, wisdom, and respect.";
      break;
    case 'Hispanic':
      persona = "You are a festive Hispanic Santa (Papa Noel). Speak with high energy and warmth. Use Spanglish naturally—inserting words like 'Hola', 'Amigo', 'Bueno', 'Feliz Navidad' into your English sentences.";
      break;
    case 'African':
      persona = "You are a regal African Santa. Speak with a deep, storytelling cadence, like a wise elder or griot. Use metaphors about nature or community.";
      break;
    case 'Classic':
    default:
      persona = "You are the traditional Santa Claus. Speak with a 'Ho ho ho' and a jolly, old-timey Christmas spirit.";
      break;
  }

  const systemInstruction = `
    ${persona}
    
    You are currently speaking to a child in a text or voice chat.
    Your tone must be warm, magical, encouraging, and jolly.
    
    IMPORTANT RULES:
    1. NEVER promise specific gifts. If a child asks for a gift, say something like "That sounds wonderful! I'll have the elves look into it," or "We'll see what fits on the sleigh!"
    2. Use the provided NOTES about the child's behavior to guide the conversation. If they have been good, praise them specifically based on the notes. If they have 'redirection' notes, gently encourage them to improve in that area.
    3. Keep responses relatively short (2-3 sentences) suitable for a chat interface.
    
    CHILD'S BEHAVIOR NOTES (Invisible to child, for your guidance only):
    ${behaviorSummary || "No specific notes yet. Assume they are a good kid!"}
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Ho ho ho! The signal from the North Pole is a bit snowy.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Ho ho ho! My magic receiver is having a hiccup. Can you say that again?";
  }
};

/**
 * Extracts a wish from a message if present.
 * Returns null if no distinct wish is found.
 */
export const extractWishFromText = async (text: string): Promise<{ item: string; priceEstimate: string } | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this text from a child: "${text}". 
      If the child is explicitly asking for a specific gift or saying they want something, return JSON.
      If not, return null.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isWish: { type: Type.BOOLEAN },
            item: { type: Type.STRING, description: "The name of the gift requested" },
            priceEstimate: { type: Type.STRING, description: "A rough estimated price range (e.g. $20-$50)" }
          },
          required: ["isWish"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    if (json.isWish && json.item) {
      return { item: json.item, priceEstimate: json.priceEstimate || "Unknown" };
    }
    return null;
  } catch (e) {
    console.error("Wish extraction failed", e);
    return null;
  }
};

/**
 * Mock Retail Search (Gemini acting as a search aggregator proxy).
 * In a real app, this would call Walmart/Target APIs.
 */
export const searchRetailersForGift = async (query: string): Promise<any[]> => {
  try {
    // We are simulating the API calls using Gemini to generate realistic mock data
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 realistic retail listings for the product: "${query}".
      One from Walmart, one from Target, one from Best Buy.
      Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              store: { type: Type.STRING, enum: ["Walmart", "Target", "Best Buy"] },
              image: { type: Type.STRING, description: "A placeholder URL" },
              url: { type: Type.STRING, description: "A dummy URL" }
            }
          }
        }
      }
    });
    
    const results = JSON.parse(response.text || "[]");
    // Inject nice images
    return results.map((r: any, idx: number) => ({
      ...r,
      image: `https://picsum.photos/200/200?random=${idx}${Math.random()}`
    }));
  } catch (e) {
    return [];
  }
};

/**
 * Text-to-Speech using Gemini 2.5 Flash TTS
 * Selects voice based on Santa Style.
 */
export const speakAsSanta = async (text: string, style: string = 'Classic'): Promise<AudioBuffer | null> => {
  let voiceName = 'Fenrir'; // Default Deep Voice
  
  // Voice Mapping
  switch (style) {
    case 'African American': 
      voiceName = 'Charon'; // Deep, resonant
      break;
    case 'Asian': 
      voiceName = 'Zephyr'; // Softer, clearer
      break;
    case 'Hispanic': 
      voiceName = 'Puck'; // Mid-range, energetic
      break;
    case 'African': 
      voiceName = 'Fenrir'; // Deep, authoritative
      break;
    case 'Classic':
    default: 
      voiceName = 'Fenrir';
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext
    );
    return audioBuffer;

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const playAudioBuffer = (buffer: AudioBuffer) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}