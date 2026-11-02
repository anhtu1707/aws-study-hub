import React from 'react';
import { ARCHITECTURE_PATTERNS } from '../data/services';

interface ArchitectureViewProps {
  onSelectServiceCode: (code: string) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectServiceCode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="stamp-badge stamp-dark">WELL-ARCHITECTED BLUEPRINTS</span>
          <span className="mono stamp-badge stamp-kraft">{ARCHITECTURE_PATTERNS.length} MẪU THỰC CHIẾN</span>
        </div>
        <h2 style={{ fontSize: '26px', margin: 0 }}>
          Mẫu Kiến Trúc AWS Tiêu Chuẩn Doanh Nghiệp
        </h2>
        <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-charcoal)', maxWidth: '780px' }}>
          Các mô hình ghép nối dịch vụ kinh điển thường xuất hiện trong các bài toán thực tế và đề thi cấp cao Solutions Architect (SAA &amp; SAP).
        </p>
      </div>

      {/* Blueprint Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '26px' }}>
        {ARCHITECTURE_PATTERNS.map((pat) => (
          <div
            key={pat.id}
            className="torn-bottom paper-shadow"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderBottom: 'none',
              padding: '28px 24px 34px 24px',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
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
                width: '70px',
                height: '20px',
                transform: 'rotate(2deg)'
              }}
            />

            {/* Pattern Header */}
            <div>
              <h3 style={{ fontSize: '20px', margin: 0, color: 'var(--text-ink)' }}>
                {pat.title}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-sepia)' }}>
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
              <strong style={{ color: 'var(--text-ink)' }}>Bài toán:</strong> {pat.problem}
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
              <strong style={{ color: 'var(--text-ink)' }}>Giải pháp kiến trúc:</strong> {pat.solution}
            </div>

            {/* Participating Services Tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--border-light)' }}>
              <span className="mono" style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Các dịch vụ phối hợp:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {pat.services.map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => onSelectServiceCode(svc)}
                    style={{
                      background: 'var(--bg-card-warm)',
                      border: '1px solid var(--border-dashed)',
                      color: 'var(--text-ink)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    {svc} →
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
