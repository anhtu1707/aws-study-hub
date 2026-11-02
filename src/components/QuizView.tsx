import React, { useState, useEffect } from 'react';
import { FLASHCARDS } from '../data/services';
import { CheckIcon, TargetIcon, SpeakerIcon, StopIcon } from './Icons';
import { speakStructuredText, buildFlashcardSpeech, subscribeSpeech, stopSpeech } from '../utils/speech';

export const QuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  const card = FLASHCARDS[currentIndex];
  const isMastered = Boolean(answeredMap[card.id]);

  useEffect(() => {
    return subscribeSpeech((speakingId) => {
      setIsSpeaking(speakingId === `card-${card.id}`);
    });
  }, [card.id]);

  const handleNext = () => {
    stopSpeech();
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrev = () => {
    stopSpeech();
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const toggleMastered = () => {
    setAnsweredMap((prev) => ({
      ...prev,
      [card.id]: !prev[card.id]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>

      {/* Header Info */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <span className="stamp-badge stamp-dark">FLASHCARDS THỰC CHIẾN</span>
          <span className="mono stamp-badge stamp-kraft">
            CÂU {currentIndex + 1} / {FLASHCARDS.length}
          </span>
        </div>
        <h2 style={{ fontSize: '24px', margin: 0 }}>
          Luyện Phản Xạ Đề Thi AWS
        </h2>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-charcoal)' }}>
          Đọc kỹ tình huống thực tế, tự đoán tên dịch vụ hoặc kiến trúc tối ưu, sau đó lật thẻ giấy để đối chiếu lời giải thích chuyên sâu.
        </p>
      </div>

      {/* Torn Paper Flashcard Box */}
      <div
        className="torn-both paper-shadow"
        style={{
          width: '100%',
          maxWidth: '680px',
          minHeight: '340px',
          background: '#FFFFFF',
          border: '1px solid var(--border-dashed)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* Top Washi Tape Pin */}
        <div
          className="washi-tape"
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '24px'
          }}
        />

        {/* Card Content Top */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span className="mono stamp-badge stamp-outline">
              MÃ ĐỀ: {card.examCode}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => speakStructuredText(`card-${card.id}`, buildFlashcardSpeech(card, isRevealed), `Flashcard ${card.examCode} • Câu ${currentIndex + 1}`)}
                title={isSpeaking ? 'Bấm để dừng đọc' : 'Nghe tình huống và lời giải (Hands-free audio)'}
                style={{
                  background: isSpeaking ? '#FDF2F0' : 'var(--bg-card-warm)',
                  color: isSpeaking ? '#C0392B' : 'var(--text-ink)',
                  border: isSpeaking ? '1px solid #C0392B' : '1px solid var(--border-dashed)',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSpeaking ? <StopIcon size={12} color="#C0392B" /> : <SpeakerIcon size={12} color="var(--text-ink)" />}
                <span>{isSpeaking ? 'Dừng đọc' : 'Nghe Audio'}</span>
              </button>

              <button
                type="button"
                onClick={toggleMastered}
                style={{
                  background: isMastered ? 'var(--text-ink)' : 'var(--bg-card-warm)',
                  color: isMastered ? '#FFFFFF' : 'var(--text-ink)',
                  border: '1px solid var(--border-dashed)',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isMastered ? (
                  <>
                    <CheckIcon size={12} color={isMastered ? '#FFFFFF' : '#155724'} />
                    <span>Đã thuộc</span>
                  </>
                ) : (
                  <span>Đánh dấu đã thuộc</span>
                )}
              </button>
            </div>
          </div>

          {/* Scenario */}
          <div
            style={{
              background: 'var(--bg-card-warm)',
              borderLeft: '3px solid var(--text-ink)',
              padding: '14px 16px',
              fontSize: '14px',
              color: 'var(--text-ink)',
              lineHeight: 1.6
            }}
          >
            <strong>Tình huống:</strong> {card.scenario}
          </div>

          {/* Question */}
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-ink)', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <TargetIcon size={16} color="var(--text-ink)" style={{ marginTop: '3px', flexShrink: 0 }} />
            <span>{card.question}</span>
          </div>

          {/* Answer Section (Revealed) */}
          {isRevealed ? (
            <div
              style={{
                marginTop: '12px',
                borderTop: '2px dashed var(--border-dashed)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Đáp án chuẩn xác:
                </span>
                <span className="mono stamp-badge stamp-dark" style={{ fontSize: '13px', padding: '4px 10px' }}>
                  {card.answer}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
                {card.explanation}
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0 10px 0' }}>
              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                style={{
                  background: 'var(--text-ink)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 28px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                Lật thẻ xem đáp án &amp; giải thích
              </button>
            </div>
          )}

        </div>

        {/* Card Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px dashed var(--border-light)',
            paddingTop: '18px',
            marginTop: '20px'
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            style={{
              background: 'var(--bg-card-warm)',
              border: '1px solid var(--border-dashed)',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '2px',
              cursor: 'pointer',
              color: 'var(--text-ink)'
            }}
          >
            ← Câu trước
          </button>

          <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {currentIndex + 1} / {FLASHCARDS.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            style={{
              background: 'var(--text-ink)',
              border: '1px solid var(--text-ink)',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '2px',
              cursor: 'pointer',
              color: '#FFFFFF'
            }}
          >
            Câu tiếp theo →
          </button>
        </div>

      </div>

    </div>
  );
};
