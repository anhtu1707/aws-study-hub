import React, { useState, useEffect, useMemo } from 'react';
import { ARCHITECTURE_PATTERNS } from '../data/services';
import { ArchitecturePattern } from '../types';
import {
  SearchIcon,
  CloseIcon,
  SpeakerIcon,
  StopIcon,
  TargetIcon,
  BookOpenIcon,
  CompassIcon
} from './Icons';
import { speakStructuredText, stopSpeech, subscribeSpeech } from '../utils/speech';

interface ArchitectureViewProps {
  onSelectServiceCode: (code: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'web-serverless', label: 'Web & Serverless' },
  { id: 'containers', label: 'Containers & K8s' },
  { id: 'genai-ml', label: 'GenAI & LLM' },
  { id: 'data-analytics', label: 'Data Lakehouse' },
  { id: 'security-finops', label: 'Security & FinOps' },
  { id: 'networking', label: 'Hybrid Network' },
  { id: 'resilience-dr', label: 'DR & Sẵn Sàng Cao' },
  { id: 'iot-edge', label: 'IoT & Edge' },
  { id: 'media-gaming', label: 'Media & Gaming' },
  { id: 'migration-enterprise', label: 'Migration' }
];

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectServiceCode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeSpeech((id) => {
      setSpeakingId(id);
    });
  }, []);

  const handleSpeakBlueprint = (pat: ArchitecturePattern) => {
    const speechId = `blueprint-${pat.id}`;
    if (speakingId === speechId) {
      stopSpeech();
      return;
    }

    const script = `Mẫu kiến trúc doanh nghiệp: ${pat.title}. ${pat.description}. Bài toán thực tế: ${pat.problem}. Giải pháp kiến trúc: ${pat.solution}. Các dịch vụ AWS cốt lõi phối hợp: ${pat.services.join(', ')}.`;
    speakStructuredText(speechId, script, `Kiến trúc ${pat.title}`);
  };

  const filteredPatterns = useMemo(() => {
    return ARCHITECTURE_PATTERNS.filter((pat) => {
      // Category filter
      if (selectedCategory !== 'all' && pat.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = pat.title.toLowerCase().includes(query);
        const matchesDesc = pat.description.toLowerCase().includes(query);
        const matchesProblem = pat.problem.toLowerCase().includes(query);
        const matchesSolution = pat.solution.toLowerCase().includes(query);
        const matchesServices = pat.services.some((s) => s.toLowerCase().includes(query));
        const matchesCat = pat.categoryName?.toLowerCase().includes(query);

        return matchesTitle || matchesDesc || matchesProblem || matchesSolution || matchesServices || matchesCat;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ARCHITECTURE_PATTERNS.length };
    for (const pat of ARCHITECTURE_PATTERNS) {
      if (pat.category) {
        counts[pat.category] = (counts[pat.category] || 0) + 1;
      }
    }
    return counts;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Header Banner */}
      <div
        className="torn-both"
        style={{
          background: '#FFFDF9',
          border: '1.5px solid var(--text-ink)',
          padding: 'clamp(16px, 4vw, 24px) clamp(14px, 4vw, 26px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="stamp-badge stamp-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CompassIcon size={12} color="#FFFFFF" />
            ENTERPRISE ARCHITECTURE HUB
          </span>
          <span className="mono stamp-badge stamp-kraft">
            {ARCHITECTURE_PATTERNS.length} MẪU THIẾT KẾ TOÀN DIỆN
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Chuẩn AWS Well-Architected Framework
          </span>
        </div>

        <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-ink)' }}>
          Kho Kiến Trúc Mẫu AWS Tiêu Chuẩn Doanh Nghiệp (Enterprise Blueprints)
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-charcoal)', lineHeight: 1.6, maxWidth: '900px' }}>
          Tuyển tập <strong>{ARCHITECTURE_PATTERNS.length} mẫu kiến trúc thực chiến</strong> trải dài 10 lĩnh vực trọng yếu (Serverless, Container Mesh, GenAI RAG, Data Lakehouse, Security SIEM, Hybrid Network, Disaster Recovery, IoT, Media &amp; Migration). Thiết kế theo chuẩn câu hỏi phân tích cấp cao của kỳ thi <strong>AWS SAP-C02, SAA-C03 và Specialty</strong>.
        </p>

        {/* Search & Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1.5px solid var(--text-ink)',
              padding: '6px 12px',
              borderRadius: '2px',
              gap: '8px',
              flex: '1 1 240px',
              minWidth: 0,
              maxWidth: '500px'
            }}
          >
            <SearchIcon size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Tìm theo tên mẫu, dịch vụ (EKS, Bedrock, S3...), bài toán..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                background: 'transparent',
                color: 'var(--text-ink)',
                fontFamily: 'inherit'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
                aria-label="Xóa tìm kiếm"
              >
                <CloseIcon size={12} color="var(--text-muted)" />
              </button>
            )}
          </div>

          <div className="mono" style={{ fontSize: '12px', color: 'var(--text-charcoal)', fontWeight: 600 }}>
            Hiển thị: <strong>{filteredPatterns.length}</strong> / {ARCHITECTURE_PATTERNS.length} mẫu kiến trúc
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: isSelected ? 'var(--text-ink)' : 'var(--bg-card-warm)',
                color: isSelected ? '#FFFFFF' : 'var(--text-ink)',
                border: isSelected ? '1px solid var(--text-ink)' : '1px solid var(--border-dashed)',
                padding: '6px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  opacity: isSelected ? 0.9 : 0.6,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPatterns.length === 0 && (
        <div
          className="paper-shadow"
          style={{
            background: '#FFFFFF',
            border: '1.5px dashed var(--text-ink)',
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-ink)' }}>
            Không tìm thấy mẫu kiến trúc nào phù hợp với từ khóa "{searchQuery}"
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="stamp-badge stamp-dark"
            style={{ cursor: 'pointer', padding: '6px 14px' }}
          >
            Đặt lại bộ lọc tìm kiếm
          </button>
        </div>
      )}

      {/* Blueprint Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px', width: '100%', minWidth: 0 }}>
        {filteredPatterns.map((pat) => {
          const isThisSpeaking = speakingId === `blueprint-${pat.id}`;

          return (
            <div
              key={pat.id}
              className="torn-bottom paper-shadow"
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderBottom: 'none',
                padding: '24px clamp(14px, 4vw, 22px) 28px clamp(14px, 4vw, 22px)',
                boxSizing: 'border-box',
                minWidth: 0,
                borderRadius: '4px 4px 0 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative'
              }}
            >
              {/* Corner Tape */}
              <div
                className="washi-tape"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '24px',
                  width: '65px',
                  height: '18px',
                  transform: 'rotate(2deg)'
                }}
              />

              {/* Pattern Header & Category Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span
                    className="stamp-badge stamp-kraft"
                    style={{ fontSize: '10px', padding: '2px 6px', letterSpacing: '0.5px' }}
                  >
                    {pat.categoryName || 'DOANH NGHIỆP'}
                  </span>

                  {/* Audio Listen Button */}
                  <button
                    type="button"
                    onClick={() => handleSpeakBlueprint(pat)}
                    title={isThisSpeaking ? 'Dừng đọc mẫu kiến trúc' : 'Nghe giọng đọc toàn bộ bài toán & giải pháp kiến trúc'}
                    style={{
                      border: isThisSpeaking ? '1px solid #C0392B' : '1px solid var(--border-dashed)',
                      background: isThisSpeaking ? '#FDF2F0' : 'var(--bg-card-warm)',
                      color: isThisSpeaking ? '#C0392B' : 'var(--text-ink)',
                      padding: '4px 8px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isThisSpeaking ? <StopIcon size={11} color="#C0392B" /> : <SpeakerIcon size={11} color="var(--text-ink)" />}
                    <span>{isThisSpeaking ? 'Dừng' : 'Nghe Audio'}</span>
                  </button>
                </div>

                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-ink)', lineHeight: 1.35 }}>
                  {pat.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-sepia)', lineHeight: 1.5 }}>
                  {pat.description}
                </p>
              </div>

              {/* Problem Box */}
              <div
                style={{
                  background: 'var(--bg-card-warm)',
                  borderLeft: '3px solid #8A7A6A',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: 'var(--text-charcoal)',
                  lineHeight: 1.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <TargetIcon size={12} color="var(--text-ink)" />
                  <strong style={{ color: 'var(--text-ink)' }}>Bài toán thực tế:</strong>
                </div>
                <div>{pat.problem}</div>
              </div>

              {/* Solution Box */}
              <div
                style={{
                  background: '#F9F5EC',
                  borderLeft: '3px solid var(--text-ink)',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                  color: 'var(--text-ink)',
                  lineHeight: 1.55
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <BookOpenIcon size={12} color="var(--text-ink)" />
                  <strong style={{ color: 'var(--text-ink)' }}>Giải pháp kiến trúc:</strong>
                </div>
                <div>{pat.solution}</div>
              </div>

              {/* Participating Services Tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--border-light)' }}>
                <span className="mono" style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Các dịch vụ phối hợp trong kiến trúc:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {pat.services.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => onSelectServiceCode(svc)}
                      title={`Bấm để tra cứu dịch vụ ${svc}`}
                      style={{
                        background: 'var(--bg-card-warm)',
                        border: '1px solid var(--border-dashed)',
                        color: 'var(--text-ink)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <span>{svc}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>→</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
