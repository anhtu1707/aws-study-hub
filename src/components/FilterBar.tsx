import React from 'react';
import { AWSCategory, ExamLevel, LearningStatus } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: AWSCategory | 'all';
  setSelectedCategory: (cat: AWSCategory | 'all') => void;
  selectedLevel: ExamLevel | 'all';
  setSelectedLevel: (level: ExamLevel | 'all') => void;
  selectedStatus: LearningStatus | 'all';
  setSelectedStatus: (status: LearningStatus | 'all') => void;
  onlyFreeTier: boolean;
  setOnlyFreeTier: (val: boolean) => void;
  categoryCounts: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  selectedStatus,
  setSelectedStatus,
  onlyFreeTier,
  setOnlyFreeTier,
  categoryCounts
}) => {
  const categories: { id: AWSCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'compute', label: 'Compute' },
    { id: 'storage', label: 'Storage' },
    { id: 'database', label: 'Database' },
    { id: 'networking', label: 'Networking' },
    { id: 'security', label: 'Security & IAM' },
    { id: 'serverless', label: 'Serverless' },
    { id: 'aiml', label: 'AI & ML' },
    { id: 'management', label: 'Management' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'devtools', label: 'CI/CD & DevTools' },
    { id: 'migration', label: 'Migration' },
    { id: 'cost', label: 'Cost & Gov' }
  ];

  const levels: (ExamLevel | 'all')[] = ['all', 'CLF', 'SAA', 'DVA', 'SOA', 'SAP'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Top Search & Level Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>

        {/* Notebook Search Input */}
        <div style={{ flex: '1 1 360px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ (S3, EC2...), từ khóa (WORM, Multi-AZ...) hoặc tác vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-dashed)',
              borderBottom: '2px solid var(--text-ink)',
              padding: '12px 16px 12px 42px',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: 'var(--text-ink)',
              borderRadius: '3px',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(40,30,20,0.03)'
            }}
          />
          <svg
            style={{
              position: 'absolute',
              left: '14px',
              top: '14px',
              width: '18px',
              height: '18px',
              stroke: 'var(--text-muted)',
              fill: 'none',
              strokeWidth: 2
            }}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '11px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px'
              }}
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Exam Level Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-kraft)',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid var(--border-dashed)',
            overflowX: 'auto'
          }}
        >
          {levels.map((lvl) => {
            const isSel = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  border: 'none',
                  background: isSel ? 'var(--text-ink)' : 'transparent',
                  color: isSel ? '#FFFFFF' : 'var(--text-charcoal)',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {lvl === 'all' ? 'Mọi chứng chỉ' : lvl}
              </button>
            );
          })}
        </div>

        {/* Free Tier Filter Toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-dashed)',
            padding: '8px 12px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12.5px',
            fontWeight: 700,
            color: 'var(--text-ink)',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={onlyFreeTier}
            onChange={(e) => setOnlyFreeTier(e.target.checked)}
            style={{ accentColor: 'var(--text-ink)', width: '15px', height: '15px' }}
          />
          Chỉ Free Tier
        </label>
      </div>

      {/* Category Filter Pills (Torn Label Strips) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginRight: '2px'
          }}
        >
          PHÂN HỆ:
        </span>
        {categories.map((c) => {
          const isSel = selectedCategory === c.id;
          const count = categoryCounts[c.id] || 0;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                border: `1px solid ${isSel ? 'var(--text-ink)' : 'var(--border-dashed)'}`,
                background: isSel ? 'var(--text-ink)' : 'var(--bg-card)',
                color: isSel ? '#FFFFFF' : 'var(--text-charcoal)',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                boxShadow: isSel ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Status Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-sepia)'
        }}
      >
        <span className="mono" style={{ fontWeight: 700 }}>
          TRẠNG THÁI:
        </span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'not_started', label: 'Chưa học' },
          { id: 'in_progress', label: 'Đang ôn' },
          { id: 'mastered', label: 'Đã thuộc' }
        ].map((st) => {
          const isSel = selectedStatus === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStatus(st.id as LearningStatus | 'all')}
              style={{
                background: isSel ? 'var(--bg-kraft)' : 'transparent',
                border: isSel ? '1px solid var(--border-crease)' : '1px solid transparent',
                color: isSel ? 'var(--text-ink)' : 'var(--text-muted)',
                fontWeight: isSel ? 700 : 500,
                padding: '3px 8px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              {st.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
