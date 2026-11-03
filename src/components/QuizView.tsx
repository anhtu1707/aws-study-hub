import React, { useState, useEffect, useMemo } from 'react';
import { FLASHCARDS } from '../data/services';
import { Flashcard } from '../types';
import { CheckIcon, TargetIcon, SpeakerIcon, StopIcon, WarningIcon, LightbulbIcon } from './Icons';
import { speakStructuredText, buildFlashcardSpeech, subscribeSpeech, stopSpeech } from '../utils/speech';

type QuizMode = 'exam' | 'flashcards' | 'mistakes';

export const QuizView: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [mode, setMode] = useState<QuizMode>('exam');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // User answers state: questionId -> chosen key ('A', 'B', 'C', 'D')
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('aws_exam_user_answers_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Mastered flashcards state
  const [masteredMap, setMasteredMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aws_exam_mastered_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aws_exam_user_answers_v1', JSON.stringify(userAnswers));
    } catch {}
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('aws_exam_mastered_v1', JSON.stringify(masteredMap));
    } catch {}
  }, [masteredMap]);

  // Exam list with counts
  const examStats = useMemo(() => {
    const counts: Record<string, number> = { all: FLASHCARDS.length };
    FLASHCARDS.forEach((q) => {
      counts[q.examCode] = (counts[q.examCode] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter questions based on selectedExam and mode
  const filteredQuestions = useMemo(() => {
    return FLASHCARDS.filter((q) => {
      if (selectedExam !== 'all' && q.examCode !== selectedExam) {
        return false;
      }
      if (mode === 'mistakes') {
        const chosen = userAnswers[q.id];
        // Only show questions answered incorrectly
        return chosen && chosen !== q.correctKey;
      }
      return true;
    });
  }, [selectedExam, mode, userAnswers]);

  // Safe current question
  const currentQuestion: Flashcard | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    stopSpeech();
  }, [selectedExam, mode]);

  // Speech subscription
  useEffect(() => {
    if (!currentQuestion) return;
    return subscribeSpeech((speakingId) => {
      setIsSpeaking(speakingId === `card-${currentQuestion.id}`);
    });
  }, [currentQuestion?.id]);

  // Handle option select in Exam mode
  const handleSelectOption = (key: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key
    }));
    setIsRevealed(true);
  };

  const handleNext = () => {
    stopSpeech();
    setIsRevealed(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setIsRevealed(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  };

  const toggleMastered = () => {
    if (!currentQuestion) return;
    setMasteredMap((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleResetScore = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ kết quả làm bài thi thử để luyện lại từ đầu?')) {
      setUserAnswers({});
      setIsRevealed(false);
    }
  };

  // Performance Scoreboard
  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = FLASHCARDS.filter((q) => userAnswers[q.id] === q.correctKey).length;
  const accuracyPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const estimatedScore = totalAnswered > 0 ? Math.round(100 + accuracyPercent * 9) : 0;
  const isPassing = estimatedScore >= 750;

  if (filteredQuestions.length === 0) {
    return (
      <div
        className="torn-both"
        style={{
          width: '100%',
          maxWidth: '720px',
          background: '#FFFFFF',
          border: '1.5px dashed var(--border-dashed)',
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'center'
        }}
      >
        <CheckIcon size={36} color="#2E7D32" />
        <h3 style={{ margin: 0, fontSize: '20px' }}>Tuyệt vời! Không có câu sai nào trong danh sách</h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-sepia)' }}>
          Bạn chưa làm sai câu nào hoặc đã hoàn thành tốt các câu đã thử. Hãy chuyển sang chế độ "Thi thử trắc nghiệm" để tiếp tục luyện đề.
        </p>
        <button
          type="button"
          onClick={() => setMode('exam')}
          style={{
            background: 'var(--text-ink)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          Quay lại thi thử trắc nghiệm
        </button>
      </div>
    );
  }

  const userChosen = currentQuestion ? userAnswers[currentQuestion.id] : undefined;
  const hasAnsweredCurrent = Boolean(userChosen);
  const isCorrect = userChosen === currentQuestion?.correctKey;
  const isMastered = currentQuestion ? Boolean(masteredMap[currentQuestion.id]) : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>

      {/* Header Info & Title */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '780px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="stamp-badge stamp-dark">NGÂN HÀNG 60 ĐỀ THI SÁT THỰC TẾ</span>
          <span className="stamp-badge stamp-kraft">
            CLF • SAA • SAP • SCS • ANS • DBS • DEA • MLS
          </span>
        </div>
        <h2 style={{ fontSize: '26px', margin: '4px 0 0 0', color: 'var(--text-ink)' }}>
          Luyện Thi Chứng Chỉ AWS Chuyên Sâu
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
          Mô phỏng sát đề thi chính thức với tình huống doanh nghiệp, 4 phương án bẫy trắc nghiệm (Distractor Analysis) và quy tắc 3 giây phản xạ nhanh.
        </p>
      </div>

      {/* Scoreboard Banner */}
      <div
        className="paper-shadow"
        style={{
          width: '100%',
          maxWidth: '820px',
          boxSizing: 'border-box',
          background: '#FFFDF9',
          border: '1.5px solid var(--text-ink)',
          borderLeft: '5px solid var(--text-ink)',
          borderRadius: '3px',
          padding: '14px clamp(12px, 3vw, 20px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Tiến độ làm bài:
            </span>
            <span className="mono" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-ink)' }}>
              {totalAnswered} / {FLASHCARDS.length} câu
            </span>
          </div>

          <div style={{ height: '28px', width: '1px', background: 'var(--border-dashed)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Tỷ lệ chính xác:
            </span>
            <span className="mono" style={{ fontSize: '15px', fontWeight: 800, color: accuracyPercent >= 75 ? '#2E7D32' : '#C0392B' }}>
              {accuracyPercent}% ({totalCorrect} đúng)
            </span>
          </div>

          <div style={{ height: '28px', width: '1px', background: 'var(--border-dashed)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Dự đoán điểm AWS:
            </span>
            <span className="mono" style={{ fontSize: '15px', fontWeight: 800, color: isPassing ? '#2E7D32' : '#8A5A2B' }}>
              {estimatedScore} / 1000 • {isPassing ? 'ĐẠT (PASS)' : 'CẦN ÔN THÊM'}
            </span>
          </div>
        </div>

        {totalAnswered > 0 && (
          <button
            type="button"
            onClick={handleResetScore}
            style={{
              background: 'transparent',
              border: '1px dashed var(--border-dashed)',
              fontSize: '11px',
              color: 'var(--text-sepia)',
              padding: '4px 10px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Làm lại từ đầu
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { id: 'exam', label: '1. Thi Thử Trắc Nghiệm (A-B-C-D)' },
          { id: 'flashcards', label: '2. Lật Thẻ Ghi Nhớ (Flashcard)' },
          { id: 'mistakes', label: `3. Ôn Riêng Câu Sai (${Object.keys(userAnswers).filter(id => { const q = FLASHCARDS.find(item => item.id === id); return q && userAnswers[id] !== q.correctKey; }).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id as QuizMode)}
            style={{
              background: mode === tab.id ? 'var(--text-ink)' : 'var(--bg-card-warm)',
              color: mode === tab.id ? '#FFFFFF' : 'var(--text-ink)',
              border: '1.5px solid var(--text-ink)',
              padding: '7px 16px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '3px',
              cursor: 'pointer',
              boxShadow: mode === tab.id ? '0 3px 10px rgba(20,15,10,0.15)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exam Code Filters */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '820px' }}>
        {[
          { code: 'all', label: `Tất cả (${examStats.all})` },
          { code: 'SAP-C02', label: `SAP-C02 Professional (${examStats['SAP-C02'] || 0})` },
          { code: 'SAA-C03', label: `SAA-C03 Associate (${examStats['SAA-C03'] || 0})` },
          { code: 'SCS-C02', label: `SCS-C02 Security (${examStats['SCS-C02'] || 0})` },
          { code: 'ANS-C01', label: `ANS-C01 Networking (${examStats['ANS-C01'] || 0})` },
          { code: 'DBS-C01', label: `DBS-C01 Database (${examStats['DBS-C01'] || 0})` },
          { code: 'DEA-C01', label: `DEA-C01 Data Engineer (${examStats['DEA-C01'] || 0})` },
          { code: 'MLS-C01', label: `MLS-C01 Machine Learning (${examStats['MLS-C01'] || 0})` },
          { code: 'DVA-C02', label: `DVA-C02 Developer (${examStats['DVA-C02'] || 0})` }
        ].map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setSelectedExam(item.code)}
            className="mono"
            style={{
              fontSize: '11px',
              fontWeight: selectedExam === item.code ? 700 : 500,
              background: selectedExam === item.code ? 'var(--text-charcoal)' : '#FFFFFF',
              color: selectedExam === item.code ? '#FFFFFF' : 'var(--text-charcoal)',
              border: selectedExam === item.code ? '1px solid var(--text-charcoal)' : '1px solid var(--border-dashed)',
              padding: '4px 10px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Question Card Container */}
      <div
        className="torn-both paper-shadow"
        style={{
          width: '100%',
          maxWidth: '820px',
          minHeight: '440px',
          background: '#FFFFFF',
          border: '1px solid var(--border-dashed)',
          padding: 'clamp(20px, 4vw, 36px) clamp(14px, 4vw, 32px)',
          boxSizing: 'border-box',
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
            width: '140px',
            height: '24px'
          }}
        />

        {/* Card Header & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="stamp-badge stamp-dark" style={{ fontSize: '11.5px' }}>
                MÃ ĐỀ: {currentQuestion.examCode}
              </span>
              <span className="mono stamp-badge stamp-kraft" style={{ fontSize: '11px' }}>
                CÂU {currentIndex + 1} / {filteredQuestions.length}
              </span>
              {currentQuestion.domain && (
                <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-sepia)', fontWeight: 600 }}>
                  • {currentQuestion.domain}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Hands-Free Audio Button */}
              <button
                type="button"
                onClick={() =>
                  speakStructuredText(
                    `card-${currentQuestion.id}`,
                    buildFlashcardSpeech(currentQuestion, isRevealed || hasAnsweredCurrent),
                    `Đề thi ${currentQuestion.examCode} • Câu ${currentIndex + 1}`
                  )
                }
                title={isSpeaking ? 'Bấm để dừng giọng đọc' : 'Nghe tình huống và 4 phương án (Google Voice HD)'}
                style={{
                  background: isSpeaking ? '#FDF2F0' : 'var(--bg-card-warm)',
                  color: isSpeaking ? '#C0392B' : 'var(--text-ink)',
                  border: isSpeaking ? '1px solid #C0392B' : '1px solid var(--border-dashed)',
                  padding: '5px 11px',
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

              {/* Mastered Bookmark Button */}
              <button
                type="button"
                onClick={toggleMastered}
                style={{
                  background: isMastered ? 'var(--text-ink)' : 'var(--bg-card-warm)',
                  color: isMastered ? '#FFFFFF' : 'var(--text-ink)',
                  border: '1px solid var(--border-dashed)',
                  padding: '5px 11px',
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
                    <CheckIcon size={12} color="#FFFFFF" />
                    <span>Đã thuộc bài</span>
                  </>
                ) : (
                  <span>Đánh dấu đã thuộc</span>
                )}
              </button>
            </div>
          </div>

          {/* Scenario Box */}
          <div
            style={{
              background: 'var(--bg-card-warm)',
              borderLeft: '4px solid var(--text-ink)',
              padding: '16px 18px',
              fontSize: '14.5px',
              color: 'var(--text-ink)',
              lineHeight: 1.6,
              borderRadius: '2px'
            }}
          >
            <strong>Tình huống thực tế:</strong> {currentQuestion.scenario}
          </div>

          {/* Target Question */}
          <div style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--text-ink)', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <TargetIcon size={18} color="var(--text-ink)" style={{ marginTop: '3px', flexShrink: 0 }} />
            <span>{currentQuestion.question}</span>
          </div>

          {/* MODE 1: EXAM SIMULATOR (A-B-C-D Multiple Choice Options) */}
          {mode === 'exam' || mode === 'mistakes' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Chọn 1 phương án kiến trúc chuẩn xác nhất:
              </div>

              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQuestion.options.map((opt) => {
                    const isSelected = userChosen === opt.key;
                    const isOptionCorrect = opt.key === currentQuestion.correctKey;
                    let borderStyle = '1.5px solid var(--border-dashed)';
                    let bgStyle = '#FFFFFF';
                    let badgeColor = 'var(--bg-card-warm)';
                    let badgeTextColor = 'var(--text-ink)';

                    if (hasAnsweredCurrent) {
                      if (isOptionCorrect) {
                        borderStyle = '2px solid #2E7D32';
                        bgStyle = '#F0F9F1';
                        badgeColor = '#2E7D32';
                        badgeTextColor = '#FFFFFF';
                      } else if (isSelected && !isOptionCorrect) {
                        borderStyle = '2px solid #C0392B';
                        bgStyle = '#FDF2F0';
                        badgeColor = '#C0392B';
                        badgeTextColor = '#FFFFFF';
                      }
                    }

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        style={{
                          border: borderStyle,
                          background: bgStyle,
                          padding: '12px 16px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span
                            className="mono"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '2px',
                              background: badgeColor,
                              color: badgeTextColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '12px',
                              flexShrink: 0,
                              border: '1px solid var(--border-dashed)'
                            }}
                          >
                            {opt.key}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: isSelected ? 700 : 500, color: 'var(--text-ink)', lineHeight: 1.5 }}>
                            {opt.text}
                          </span>
                        </div>

                        {/* Distractor Explanation (Shown once answered) */}
                        {hasAnsweredCurrent && opt.explanation && (
                          <div
                            style={{
                              marginLeft: '34px',
                              fontSize: '12.5px',
                              lineHeight: 1.45,
                              color: isOptionCorrect ? '#1B5E20' : '#8A5A2B'
                            }}
                          >
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Result Summary Bar when Answered */}
              {hasAnsweredCurrent && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '14px 18px',
                    borderRadius: '3px',
                    background: isCorrect ? '#F0F9F1' : '#FDF2F0',
                    border: isCorrect ? '1.5px solid #2E7D32' : '1.5px solid #C0392B',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCorrect ? (
                      <>
                        <CheckIcon size={16} color="#2E7D32" />
                        <span style={{ fontWeight: 800, color: '#1B5E20', fontSize: '14px' }}>
                          CHÍNH XÁC! Đáp án đúng là phương án {currentQuestion.correctKey}: {currentQuestion.answer}
                        </span>
                      </>
                    ) : (
                      <>
                        <WarningIcon size={16} color="#C0392B" />
                        <span style={{ fontWeight: 800, color: '#C0392B', fontSize: '14px' }}>
                          CHƯA ĐÚNG! Đáp án chuẩn xác là phương án {currentQuestion.correctKey}: {currentQuestion.answer}
                        </span>
                      </>
                    )}
                  </div>

                  <div style={{ fontSize: '13.5px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
                    <strong>Phân tích lý giải:</strong> {currentQuestion.explanation}
                  </div>

                  {currentQuestion.decisionRule && (
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderLeft: '3px solid #2E7D32',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        color: '#155724',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <LightbulbIcon size={13} color="#2E7D32" />
                      <span><strong>Quy tắc 3 giây chọn đáp án:</strong> {currentQuestion.decisionRule}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: CLASSIC FLASHCARD FLIP */
            <div style={{ marginTop: '10px' }}>
              {isRevealed ? (
                <div
                  style={{
                    borderTop: '2px dashed var(--border-dashed)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Đáp án chuẩn xác:
                    </span>
                    <span className="mono stamp-badge stamp-dark" style={{ fontSize: '13px', padding: '4px 10px' }}>
                      {currentQuestion.correctKey ? `${currentQuestion.correctKey}: ` : ''}{currentQuestion.answer}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
                    {currentQuestion.explanation}
                  </p>

                  {currentQuestion.decisionRule && (
                    <div
                      style={{
                        background: '#F0F9F1',
                        borderLeft: '3px solid #2E7D32',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        color: '#155724',
                        borderRadius: '2px',
                        marginTop: '4px'
                      }}
                    >
                      <strong>Quy tắc 3 giây:</strong> {currentQuestion.decisionRule}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '28px 0 12px 0' }}>
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
                    Lật thẻ xem đáp án &amp; phân tích bẫy
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px dashed var(--border-light)',
            paddingTop: '20px',
            marginTop: '24px',
            flexWrap: 'wrap',
            gap: '10px'
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
            Câu {currentIndex + 1} trên tổng số {filteredQuestions.length} câu {selectedExam !== 'all' ? selectedExam : ''}
          </span>

          <button
            type="button"
            onClick={handleNext}
            style={{
              background: 'var(--text-ink)',
              border: '1.5px solid var(--text-ink)',
              padding: '8px 18px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '2px',
              cursor: 'pointer',
              color: '#FFFFFF',
              boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
            }}
          >
            Câu tiếp theo →
          </button>
        </div>

      </div>

    </div>
  );
};
