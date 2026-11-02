import { AWSService, Flashcard } from '../types';
import { getDetailedExamAndPricing } from '../data/examAndPricingDetails';

export type SpeechEngine = 'google' | 'browser';

export interface SpeechStatus {
  speakingId: string | null;
  isPlaying: boolean;
  title: string;
  engine: SpeechEngine;
  rate: number;
}

// Global player state
let currentStatus: SpeechStatus = {
  speakingId: null,
  isPlaying: false,
  title: '',
  engine: 'google',
  rate: 1.0
};

const statusListeners = new Set<(status: SpeechStatus) => void>();

export const subscribeSpeechStatus = (listener: (status: SpeechStatus) => void) => {
  statusListeners.add(listener);
  listener(currentStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

const notifyStatus = (partial: Partial<SpeechStatus>) => {
  currentStatus = { ...currentStatus, ...partial };
  statusListeners.forEach((fn) => fn(currentStatus));
};

// Check browser support for Web Speech API fallback
export const isBrowserSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// HTML5 Audio Queue Player for Google Neural Voice (Chị Google - Chuẩn Tiếng Việt rõ chữ)
let audioQueue: string[] = [];
let currentQueueIndex = 0;
let currentAudioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Normalize technical acronyms for clear pronunciation in Vietnamese
export const normalizeTextForSpeech = (raw: string): string => {
  let text = raw
    // Strip markdown formatting
    .replace(/[`*#_>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Acronym and technical term expansion for crystal-clear Vietnamese speech
  const acronyms: [RegExp, string][] = [
    [/\bAWS\b/g, 'A-W-S'],
    [/\bEC2\b/g, 'E-C-2'],
    [/\bS3\b/g, 'S-3'],
    [/\bVPC\b/g, 'V-P-C'],
    [/\bIAM\b/g, 'I-A-M'],
    [/\bRDS\b/g, 'R-D-S'],
    [/\bEBS\b/g, 'E-B-S'],
    [/\bEFS\b/g, 'E-F-S'],
    [/\bSQS\b/g, 'S-Q-S'],
    [/\bSNS\b/g, 'S-N-S'],
    [/\bSES\b/g, 'S-E-S'],
    [/\bWAF\b/g, 'W-A-F'],
    [/\bKMS\b/g, 'K-M-S'],
    [/\bEKS\b/g, 'E-K-S'],
    [/\bECS\b/g, 'E-C-S'],
    [/\bECR\b/g, 'E-C-R'],
    [/\bALB\b/g, 'A-L-B'],
    [/\bNLB\b/g, 'N-L-B'],
    [/\bAPI\b/g, 'A-P-I'],
    [/\bCLI\b/g, 'C-L-I'],
    [/\bGUI\b/g, 'G-U-I'],
    [/\bDNS\b/g, 'D-N-S'],
    [/\bNAT\b/g, 'N-A-T'],
    [/\bRPO\b/g, 'R-P-O'],
    [/\bRTO\b/g, 'R-T-O'],
    [/\bWORM\b/g, 'W-O-R-M, ghi một lần đọc nhiều lần'],
    [/\bMulti-AZ\b/g, 'Đa vùng Multi A-Z'],
    [/\bMulti-Region\b/g, 'Đa khu vực Multi Region'],
    [/\bServerless\b/g, 'Không máy chủ Serverless'],
    [/\bMicroservices\b/g, 'Kiến trúc vi dịch vụ Microservices'],
    [/\bFinOps\b/g, 'Quản trị chi phí Fin-Ops'],
    [/\bCold Start\b/g, 'Khởi động nguội Cold Start'],
    [/\bFree Tier\b/g, 'Gói miễn phí Free Tier'],
    [/\bAuto Scaling\b/g, 'Tự động mở rộng Auto Scaling'],
    [/\bSAA-C03\b/g, 'chứng chỉ S-A-A C 0 3'],
    [/\bSAP-C02\b/g, 'chứng chỉ S-A-P C 0 2'],
    [/\bSCS-C02\b/g, 'chứng chỉ S-C-S C 0 2'],
    [/\bANS-C01\b/g, 'chứng chỉ A-N-S C 0 1'],
    [/\bDBS-C01\b/g, 'chứng chỉ D-B-S C 0 1'],
    [/\bDAS-C01\b/g, 'chứng chỉ D-A-S C 0 1'],
    [/\bMLS-C01\b/g, 'chứng chỉ M-L-S C 0 1'],
    [/\bDVA-C02\b/g, 'chứng chỉ D-V-A C 0 2'],
    [/\bCLF\b/g, 'C-L-F'],
    [/\bSAA\b/g, 'S-A-A'],
    [/\bSAP\b/g, 'S-A-P'],
    [/\s*->\s*/g, ' chuyển sang '],
    [/\s*\/\s*/g, ' hoặc '],
    [/&amp;/g, ' và '],
    [/&/g, ' và ']
  ];

  for (const [re, rep] of acronyms) {
    text = text.replace(re, rep);
  }

  return text;
};

// Split Vietnamese text into manageable sentence chunks (<= 160 chars) for Google TTS
export const splitIntoAudioChunks = (text: string, maxLen = 160): string[] => {
  const normalized = normalizeTextForSpeech(text);
  // Split on punctuation (. ! ? : ; \n)
  const segments = normalized.match(/[^.!?:\n]+[.!?:\n]+|[^.!?:\n]+$/g) || [normalized];
  const chunks: string[] = [];
  let cur = '';

  for (const s of segments) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if ((cur + ' ' + trimmed).trim().length <= maxLen) {
      cur = (cur + ' ' + trimmed).trim();
    } else {
      if (cur) chunks.push(cur);
      if (trimmed.length > maxLen) {
        // Fallback split by commas or words if a single sentence exceeds maxLen
        const parts = trimmed.split(/,\s*/);
        cur = '';
        for (const p of parts) {
          if ((cur + ', ' + p).trim().length <= maxLen) {
            cur = (cur ? cur + ', ' + p : p).trim();
          } else {
            if (cur) chunks.push(cur);
            cur = p;
          }
        }
      } else {
        cur = trimmed;
      }
    }
  }

  if (cur) chunks.push(cur);
  return chunks.filter((c) => c.length > 0);
};

// Stop all playing audio / speech
export const stopSpeech = () => {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.onended = null;
    currentAudioElement.onerror = null;
    currentAudioElement = null;
  }
  audioQueue = [];
  currentQueueIndex = 0;

  if (isBrowserSpeechSupported()) {
    window.speechSynthesis.cancel();
    if (currentUtterance) {
      currentUtterance.onend = null;
      currentUtterance.onerror = null;
      currentUtterance = null;
    }
  }

  notifyStatus({ speakingId: null, isPlaying: false, title: '' });
};

// Pause currently active audio
export const pauseSpeech = () => {
  if (currentStatus.engine === 'google' && currentAudioElement) {
    currentAudioElement.pause();
    notifyStatus({ isPlaying: false });
  } else if (isBrowserSpeechSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    notifyStatus({ isPlaying: false });
  }
};

// Resume paused audio
export const resumeSpeech = () => {
  if (currentStatus.engine === 'google' && currentAudioElement) {
    currentAudioElement.play().catch(() => {});
    notifyStatus({ isPlaying: true });
  } else if (isBrowserSpeechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    notifyStatus({ isPlaying: true });
  }
};

// Change playback speed (0.85x - 1.25x)
export const setSpeechRate = (newRate: number) => {
  notifyStatus({ rate: newRate });
  if (currentAudioElement) {
    currentAudioElement.playbackRate = newRate;
  }
};

// Change engine (google or browser)
export const setSpeechEngine = (newEngine: SpeechEngine) => {
  notifyStatus({ engine: newEngine });
};

// Play next chunk in Google TTS queue
const playNextGoogleChunk = (id: string) => {
  if (currentQueueIndex >= audioQueue.length) {
    stopSpeech();
    return;
  }

  const chunk = audioQueue[currentQueueIndex];
  // Same-origin Vite proxy to bypass external referer blocks
  const url = `/api/tts?q=${encodeURIComponent(chunk)}`;

  const audio = new Audio(url);
  currentAudioElement = audio;
  audio.playbackRate = currentStatus.rate;

  let hasFailed = false;
  const handleChunkError = (reason: string) => {
    if (hasFailed) return;
    hasFailed = true;
    console.warn(`TTS playback error (${reason}), falling back to browser speech`);
    fallbackToBrowserSpeech(id, audioQueue.slice(currentQueueIndex).join('. '));
  };

  audio.onended = () => {
    currentQueueIndex++;
    playNextGoogleChunk(id);
  };

  audio.onerror = () => {
    handleChunkError('Audio element onerror');
  };

  audio.play().catch((err) => {
    handleChunkError(err?.message || 'Audio play() rejected');
  });
};

// Fallback to Web Speech API
const fallbackToBrowserSpeech = (_id: string, text: string) => {
  if (!isBrowserSpeechSupported()) {
    stopSpeech();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(normalizeTextForSpeech(text));
  currentUtterance = utterance;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(
    (v) =>
      v.lang === 'vi-VN' ||
      v.lang.startsWith('vi') ||
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('vietnamese')
  );

  if (viVoice) {
    utterance.voice = viVoice;
    utterance.lang = viVoice.lang;
  } else {
    utterance.lang = 'vi-VN';
  }

  utterance.rate = currentStatus.rate * 0.95;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    stopSpeech();
  };

  utterance.onerror = () => {
    stopSpeech();
  };

  window.speechSynthesis.speak(utterance);
};

// Primary Entry Point: Speak structured text
export const speakStructuredText = (
  id: string,
  rawText: string,
  title = 'Bài học âm thanh'
) => {
  // If clicking on currently active playing item, toggle pause/stop
  if (currentStatus.speakingId === id) {
    if (currentStatus.isPlaying) {
      stopSpeech();
    } else {
      resumeSpeech();
    }
    return;
  }

  stopSpeech();

  notifyStatus({
    speakingId: id,
    isPlaying: true,
    title
  });

  if (currentStatus.engine === 'google') {
    const chunks = splitIntoAudioChunks(rawText);
    if (chunks.length === 0) {
      stopSpeech();
      return;
    }
    audioQueue = chunks;
    currentQueueIndex = 0;
    playNextGoogleChunk(id);
  } else {
    fallbackToBrowserSpeech(id, rawText);
  }
};

// Legacy subscribe wrapper for backward compatibility with ServiceCard
export const subscribeSpeech = (listener: (speakingId: string | null) => void) => {
  return subscribeSpeechStatus((status) => {
    listener(status.speakingId);
  });
};

// Structured speech scripts: Card
export const buildCardSpeech = (service: AWSService): string => {
  return [
    `Dịch vụ ${service.code}.`,
    `Tên đầy đủ: ${service.name}.`,
    `Phân hệ: ${service.categoryLabel}.`,
    `Cấp độ thi: ${service.levels.join(', ')}.`,
    service.freeTier ? 'Dịch vụ này có hỗ trợ gói miễn phí Free Tier.' : '',
    `Bản chất cốt lõi: ${service.summary}.`,
    `Khi nào nên chọn: ${service.whenToChoose}.`,
    `Mẹo thi quan trọng: ${service.examTip}.`,
    `Thường đi cùng các dịch vụ: ${service.relatedServices.slice(0, 3).join(', ')}.`
  ]
    .filter(Boolean)
    .join('. ');
};

// Structured speech scripts: Detailed Dossier
export const buildDetailedSpeech = (service: AWSService): string => {
  const intel = getDetailedExamAndPricing(service);
  return [
    `Hồ sơ âm thanh dịch vụ: ${service.code}, ${service.name}. Thuộc phân hệ ${service.categoryLabel}.`,
    `Phần một: Bản chất dịch vụ và kiến trúc nền tảng. ${service.fullDescription}.`,
    `Khi nào nên lựa chọn dịch vụ này trong kiến trúc thực tế: ${service.whenToChoose}.`,
    `Phần hai: Mẹo thi sát đề và bẫy câu hỏi trắc nghiệm.`,
    `Bản chất câu hỏi kiểm tra năng lực: ${intel.exam.coreConcept}.`,
    `Từ khóa vàng nhận diện bài toán trong đề: ${intel.exam.keywords.join(', ')}.`,
    `Cạm bẫy câu hỏi thường gặp cần lưu ý: ${intel.exam.trapsAndDistractors.join('. ')}.`,
    `Quy tắc 3 giây chọn đáp án chuẩn xác: ${intel.exam.decisionRule}.`,
    `Phần ba: Cạm bẫy chi phí và chiến thuật FinOps tiết kiệm ngân sách.`,
    `Mô hình tính cước cốt lõi: ${intel.pricing.billingModel}.`,
    `Các loại chi phí ngầm dễ gây sốc hóa đơn: ${intel.pricing.hiddenCosts.join('. ')}.`,
    `Quy tắc Free Tier và ngưỡng miễn phí: ${intel.pricing.freeTierRules}.`,
    `Chiến thuật tối ưu chi phí: ${intel.pricing.costOptimizationTactics.join('. ')}.`
  ].join('. ');
};

// Structured speech scripts: Flashcards
export const buildFlashcardSpeech = (card: Flashcard, revealed: boolean): string => {
  if (!revealed) {
    return `Tình huống đề thi ${card.examCode}. ${card.scenario}. Câu hỏi: ${card.question}. Hãy suy nghĩ câu trả lời trước khi lật thẻ đối chiếu.`;
  }
  return `Tình huống đề thi ${card.examCode}. ${card.scenario}. Câu hỏi: ${card.question}. Đáp án chuẩn xác là: ${card.answer}. Lời giải thích chuyên sâu: ${card.explanation}.`;
};
