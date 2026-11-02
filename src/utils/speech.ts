import { AWSService, Flashcard } from '../types';
import { getDetailedExamAndPricing } from '../data/examAndPricingDetails';

// Check browser support for Speech Synthesis
export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Global reference to active utterance to prevent garbage collection bugs in Chrome
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeakerListeners = new Set<(speakingId: string | null) => void>();
let currentSpeakingId: string | null = null;

export const subscribeSpeech = (listener: (speakingId: string | null) => void) => {
  activeSpeakerListeners.add(listener);
  listener(currentSpeakingId);
  return () => {
    activeSpeakerListeners.delete(listener);
  };
};

const notifySpeechListeners = (id: string | null) => {
  currentSpeakingId = id;
  activeSpeakerListeners.forEach((fn) => fn(id));
};

// Get Vietnamese voice if available
const getVietnameseVoice = (): SpeechSynthesisVoice | null => {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'vi-VN' || v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('vietnamese')) ||
    null
  );
};

export const stopSpeech = () => {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  if (currentUtterance) {
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
  }
  currentUtterance = null;
  notifySpeechListeners(null);
};

export const speakStructuredText = (
  id: string,
  text: string,
  onEnd?: () => void
) => {
  if (!isSpeechSupported()) {
    alert('Trình duyệt của bạn không hỗ trợ tính năng Text-to-Speech.');
    return;
  }

  // Toggle stop if already speaking this id
  if (currentSpeakingId === id && window.speechSynthesis.speaking) {
    stopSpeech();
    return;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  const viVoice = getVietnameseVoice();
  if (viVoice) {
    utterance.voice = viVoice;
    utterance.lang = viVoice.lang;
  } else {
    utterance.lang = 'vi-VN';
  }

  utterance.rate = 0.95; // Slightly measured pace for technical architecture clarity
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    notifySpeechListeners(id);
  };

  utterance.onend = () => {
    currentUtterance = null;
    notifySpeechListeners(null);
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    notifySpeechListeners(null);
  };

  window.speechSynthesis.speak(utterance);
};

// Build clear audio script for quick card listening
export const buildCardSpeech = (service: AWSService): string => {
  return [
    `Dịch vụ ${service.code}. Tên đầy đủ là ${service.name}.`,
    `Phân hệ: ${service.categoryLabel}. Cấp độ thi: ${service.levels.join(', ')}.`,
    service.freeTier ? 'Dịch vụ này có hỗ trợ gói miễn phí Free Tier.' : '',
    `Tóm tắt cốt lõi: ${service.summary}.`,
    `Khi nào nên chọn trong kiến trúc thực tế: ${service.whenToChoose}.`,
    `Mẹo thi trọng tâm: ${service.examTip}.`,
    `Thường phối hợp cùng: ${service.relatedServices.slice(0, 3).join(', ')}.`
  ]
    .filter(Boolean)
    .join(' ');
};

// Build clear deep-dive audio script for modal walkthrough
export const buildDetailedSpeech = (service: AWSService): string => {
  const intel = getDetailedExamAndPricing(service);
  return [
    `Hồ sơ âm thanh dịch vụ: ${service.code}, ${service.name}. Thuộc phân hệ ${service.categoryLabel}.`,
    `Phần một: Bản chất dịch vụ và kiến trúc nền tảng. ${service.fullDescription}.`,
    `Khi nào nên chọn dịch vụ này trong kiến trúc thực tế: ${service.whenToChoose}.`,
    `Phần hai: Mẹo thi sát đề và bẫy câu hỏi.`,
    `Bản chất câu hỏi kiểm tra: ${intel.exam.coreConcept}.`,
    `Từ khóa vàng nhận diện bài toán trong đề thi: ${intel.exam.keywords.join(', ')}.`,
    `Cạm bẫy câu hỏi thường gặp: ${intel.exam.trapsAndDistractors.join('. ')}.`,
    `Quy tắc 3 giây chọn đáp án: ${intel.exam.decisionRule}.`,
    `Phần ba: Cạm bẫy chi phí và chiến thuật FinOps.`,
    `Mô hình tính cước cốt lõi: ${intel.pricing.billingModel}.`,
    `Chi phí ngầm dễ gây sốc hóa đơn: ${intel.pricing.hiddenCosts.join('. ')}.`,
    `Quy tắc Free Tier: ${intel.pricing.freeTierRules}.`,
    `Chiến thuật tối ưu chi phí FinOps: ${intel.pricing.costOptimizationTactics.join('. ')}.`
  ].join(' ');
};

// Build clear audio script for flashcards
export const buildFlashcardSpeech = (card: Flashcard, revealed: boolean): string => {
  if (!revealed) {
    return `Tình huống đề thi ${card.examCode}. ${card.scenario}. Câu hỏi: ${card.question}. Hãy suy nghĩ đáp án trước khi lật thẻ.`;
  }
  return `Tình huống đề thi ${card.examCode}. ${card.scenario}. Câu hỏi: ${card.question}. Đáp án chuẩn xác là: ${card.answer}. Giải thích chi tiết: ${card.explanation}.`;
};
