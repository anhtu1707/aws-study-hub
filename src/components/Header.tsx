import React, { useRef } from 'react';

interface HeaderProps {
  totalServices: number;
  learnedCount: number;
  inProgressCount: number;
  activeTab: 'catalog' | 'quiz' | 'patterns';
  setActiveTab: (tab: 'catalog' | 'quiz' | 'patterns') => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalServices,
  learnedCount,
  inProgressCount,
  activeTab,
  setActiveTab,
  onExport,
  onImport,
  onReset
}) => {
  const percent = Math.round((learnedCount / totalServices) * 100) || 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header
      className="torn-bottom"
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderBottom: 'none',
        boxShadow: '0 4px 20px rgba(50, 40, 30, 0.05)',
        padding: '36px 32px 42px 32px',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Washi Tape Pins on corners */}
      <div
        className="washi-tape"
        style={{
          position: 'absolute',
          top: '-12px',
          left: '36px',
          width: '100px',
          height: '24px',
          transform: 'rotate(-2.5deg)'
        }}
      />
      <div
        className="washi-tape"
        style={{
          position: 'absolute',
          top: '-12px',
          right: '36px',
          width: '100px',
          height: '24px',
          transform: 'rotate(2deg)'
        }}
      />

      {/* Top Meta Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px dashed var(--border-dashed)',
          paddingBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="stamp-badge stamp-dark">
            AWS ARCHITECT HANDBOOK
          </span>
          <span
            className="mono"
            style={{ fontSize: '11px', color: 'var(--text-sepia)', fontWeight: 600 }}
          >
            REV. 2026 // CLF-C02 • SAA-C03 • SAP-C02
          </span>
        </div>

        {/* Action Buttons: Export, Import & Reset */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onExport}
            style={{
              background: 'var(--bg-card-warm)',
              border: '1px solid var(--border-dashed)',
              color: 'var(--text-ink)',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '5px 11px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Sao lưu (JSON)
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'var(--bg-card-warm)',
              border: '1px solid var(--border-dashed)',
              color: 'var(--text-ink)',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '5px 11px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Khôi phục (JSON)
          </button>

          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'transparent',
              border: '1px solid #D6C8B5',
              color: 'var(--text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              padding: '5px 9px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '24px'
        }}
      >
        <div style={{ flex: '1 1 540px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '32px', margin: 0, lineHeight: 1.15 }}>
            Sổ Tay Tự Học Toàn Bộ Dịch Vụ AWS
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-charcoal)', maxWidth: '720px', lineHeight: 1.6 }}>
            Bản đồ hệ thống hóa hơn <strong>{totalServices} dịch vụ AWS cốt lõi</strong>.
            Trang bị mẹo thi thực chiến, cạm bẫy chi phí hàng tháng, câu lệnh AWS CLI và bài toán tình huống.
          </p>
        </div>

        {/* Study Stats Widget */}
        <div
          style={{
            background: 'var(--bg-card-warm)',
            border: '1px dashed var(--border-dashed)',
            padding: '14px 20px',
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '220px'
          }}
        >
          <div
            className="mono"
            style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >
            Tiến độ học tập cá nhân
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-ink)', lineHeight: 1 }}>
              {percent}%
            </span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-sepia)', fontWeight: 600 }}>
              ({learnedCount}/{totalServices} dịch vụ)
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-sepia)', display: 'flex', gap: '12px' }}>
            <span>Đang học: <strong>{inProgressCount}</strong></span>
            <span>Chưa học: <strong>{totalServices - learnedCount - inProgressCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            width: '100%',
            height: '10px',
            background: 'var(--bg-kraft)',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid var(--border-dashed)',
            padding: '1px'
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--text-ink)',
              width: `${Math.max(4, percent)}%`,
              borderRadius: '1px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <nav
        style={{
          display: 'flex',
          gap: '10px',
          borderTop: '1px dashed var(--border-dashed)',
          paddingTop: '18px',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          style={{
            background: activeTab === 'catalog' ? 'var(--text-ink)' : 'var(--bg-card-warm)',
            color: activeTab === 'catalog' ? '#FFFFFF' : 'var(--text-ink)',
            border: `1px solid ${activeTab === 'catalog' ? 'var(--text-ink)' : 'var(--border-dashed)'}`,
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Kho Dịch Vụ ({totalServices})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          style={{
            background: activeTab === 'quiz' ? 'var(--text-ink)' : 'var(--bg-card-warm)',
            color: activeTab === 'quiz' ? '#FFFFFF' : 'var(--text-ink)',
            border: `1px solid ${activeTab === 'quiz' ? 'var(--text-ink)' : 'var(--border-dashed)'}`,
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Luyện Flashcards &amp; Tình Huống Thi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patterns')}
          style={{
            background: activeTab === 'patterns' ? 'var(--text-ink)' : 'var(--bg-card-warm)',
            color: activeTab === 'patterns' ? '#FFFFFF' : 'var(--text-ink)',
            border: `1px solid ${activeTab === 'patterns' ? 'var(--text-ink)' : 'var(--border-dashed)'}`,
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          Mẫu Kiến Trúc Chuẩn (Architectures)
        </button>
      </nav>
    </header>
  );
};
