import React, { useState } from 'react';
import { AWSService, LearningStatus } from '../types';

interface ServiceDetailModalProps {
  service: AWSService;
  status: LearningStatus;
  note: string;
  onStatusChange: (status: LearningStatus) => void;
  onNoteChange: (note: string) => void;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  status,
  note,
  onStatusChange,
  onNoteChange,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(service.cliSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 18, 16, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="torn-both"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#FFFFFF',
          border: '1px solid var(--border-dashed)',
          boxShadow: '0 20px 50px rgba(20, 15, 10, 0.25)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative'
        }}
      >
        {/* Top Washi Strip Pin */}
        <div
          className="washi-tape"
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '160px',
            height: '26px'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            borderBottom: '2px dashed var(--border-dashed)',
            paddingBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-ink)' }}>
                {service.code}
              </span>
              <span className="stamp-badge stamp-dark" style={{ fontSize: '11px' }}>
                {service.categoryLabel}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {service.levels.map((lvl) => (
                  <span key={lvl} className="stamp-badge stamp-kraft" style={{ fontSize: '10px' }}>
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {service.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid var(--text-ink)',
              background: 'var(--bg-card-warm)',
              color: 'var(--text-ink)',
              fontWeight: 800,
              width: '34px',
              height: '34px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        {/* Full Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Bản chất dịch vụ &amp; Kiến trúc nền tảng:
          </div>
          <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-ink)', lineHeight: 1.6 }}>
            {service.fullDescription}
          </p>
        </div>

        {/* When to Choose Box */}
        <div
          style={{
            background: 'var(--bg-card-warm)',
            border: '1px solid var(--border-dashed)',
            padding: '14px 18px',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)', textTransform: 'uppercase' }}>
            🎯 Khi nào nên chọn dịch vụ này?
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
            {service.whenToChoose}
          </div>
        </div>

        {/* Exam Trap & Pricing Trap Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>

          {/* Exam Trap */}
          <div
            style={{
              background: '#FFFDF9',
              borderLeft: '3px solid var(--text-ink)',
              borderTop: '1px dashed var(--border-dashed)',
              borderBottom: '1px dashed var(--border-dashed)',
              borderRight: '1px dashed var(--border-dashed)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)', textTransform: 'uppercase' }}>
              💡 Mẹo thi sát đề (Exam Tips):
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
              {service.examTip}
            </div>
          </div>

          {/* Pricing Gotcha */}
          <div
            style={{
              background: '#FAF6EE',
              borderLeft: '3px solid #8A5A2B',
              borderTop: '1px dashed var(--border-dashed)',
              borderBottom: '1px dashed var(--border-dashed)',
              borderRight: '1px dashed var(--border-dashed)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#8A5A2B', textTransform: 'uppercase' }}>
              ⚠️ Cạm bẫy chi phí (Pricing Gotcha):
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
              {service.pricingGotcha}
            </div>
          </div>

        </div>

        {/* Docker Lab Suite (If available for local practice) */}
        {service.dockerLab && (
          <div
            style={{
              background: 'var(--bg-card-warm)',
              border: '1.5px dashed var(--text-ink)',
              padding: '16px 18px',
              borderRadius: '3px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stamp-badge stamp-dark" style={{ fontSize: '11px' }}>
                🐳 PHÒNG LAB DOCKER CỤC BỘ (THỰC HÀNH TEST)
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Target: {service.dockerLab.profile}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-charcoal)' }}>
              {service.dockerLab.description}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-dashed)', padding: '10px 12px', borderRadius: '2px' }}>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  LỆNH KHỞI ĐỘNG LAB:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-ink)' }}>
                    {service.dockerLab.command}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(service.dockerLab!.command)}
                    style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-dashed)', padding: '2px 6px', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-dashed)', padding: '10px 12px', borderRadius: '2px' }}>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  LỆNH TẮT SAU KHI HỌC XONG:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code className="mono" style={{ fontSize: '12px', fontWeight: 700, color: '#8A5A2B' }}>
                    {service.dockerLab.stopCommand}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(service.dockerLab!.stopCommand)}
                    style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-dashed)', padding: '2px 6px', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-sepia)' }}>
                Endpoint: <code className="mono" style={{ color: 'var(--text-ink)', fontWeight: 600 }}>{service.dockerLab.endpoint}</code>
                {service.dockerLab.guiUrl && (
                  <span style={{ marginLeft: '12px' }}>
                    Web GUI: <a href={service.dockerLab.guiUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 700, color: 'var(--text-ink)' }}>Mở Web Console ↗</a>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  onStatusChange('mastered');
                  alert('✓ Đã lưu tiến độ: Dịch vụ này đã được đánh dấu là ĐÃ THUỘC!');
                }}
                style={{
                  background: 'var(--text-ink)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '7px 14px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              >
                ✓ Đã Hoàn Thành Lab &amp; Lưu Tiến Độ
              </button>
            </div>
          </div>
        )}

        {/* CLI Snippet Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AWS CLI Thực Chiến:
            </span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-dashed)',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
                color: 'var(--text-charcoal)'
              }}
            >
              {copied ? 'Đã sao chép!' : 'Sao chép lệnh'}
            </button>
          </div>
          <div
            className="mono"
            style={{
              background: 'var(--text-ink)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              padding: '14px 16px',
              borderRadius: '3px',
              overflowX: 'auto',
              lineHeight: 1.5
            }}
          >
            {service.cliSnippet}
          </div>
        </div>

        {/* Personal Note Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Ghi chú cá nhân (Tự động lưu vào máy):
          </label>
          <textarea
            placeholder="Viết ghi chú, điểm cần nhớ khi giải đề hoặc kinh nghiệm thực tế về dịch vụ này..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'var(--bg-card-warm)',
              border: '1px solid var(--border-dashed)',
              padding: '10px 12px',
              fontFamily: 'inherit',
              fontSize: '13px',
              color: 'var(--text-ink)',
              borderRadius: '2px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px dashed var(--border-dashed)',
            paddingTop: '16px'
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-sepia)' }}>
            Dịch vụ liên kết: <strong>{service.relatedServices.join(', ')}</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Trạng thái:</span>
            {(['not_started', 'in_progress', 'mastered'] as LearningStatus[]).map((st) => {
              const labels = {
                not_started: 'Chưa học',
                in_progress: 'Đang ôn',
                mastered: 'Đã thuộc'
              };
              const isSel = status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(st)}
                  style={{
                    background: isSel ? 'var(--text-ink)' : 'var(--bg-card-warm)',
                    color: isSel ? '#FFFFFF' : 'var(--text-ink)',
                    border: `1px solid ${isSel ? 'var(--text-ink)' : 'var(--border-dashed)'}`,
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  {labels[st]}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
