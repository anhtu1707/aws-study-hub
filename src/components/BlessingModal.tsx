import React, { useState } from 'react';
import { CloseIcon, CopyIcon, CoffeeIcon, HeartIcon, CheckIcon } from './Icons';

interface BlessingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlessingModal: React.FC<BlessingModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyStk = () => {
    navigator.clipboard.writeText('16601281');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrUrl = 'https://img.vietqr.io/image/ACB-16601281-compact2.png?addInfo=Ban%20phuoc%20lanh%20AWS%20Hub';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 18, 16, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 'clamp(10px, 3vw, 20px)'
      }}
      onClick={onClose}
    >
      <div
        className="torn-both paper-shadow"
        style={{
          background: '#FAF7F2',
          border: '1.5px solid var(--text-ink)',
          maxWidth: '460px',
          width: '100%',
          boxSizing: 'border-box',
          padding: 'clamp(20px, 4vw, 30px) clamp(14px, 4vw, 24px)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Washi Tape Header */}
        <div
          className="washi-tape"
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '120px',
            height: '24px'
          }}
        />

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="stamp-badge stamp-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CoffeeIcon size={12} color="#FFFFFF" />
                ỦNG HỘ TÁC GIẢ
              </span>
              <span className="stamp-badge stamp-kraft">
                VIETQR ACB
              </span>
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: 'var(--text-ink)', fontWeight: 800 }}>
              Nếu Thấy Hay Hãy Ban Phước Lành Cho Tui ☕
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid var(--text-ink)',
              background: '#FFFFFF',
              color: 'var(--text-ink)',
              width: '32px',
              height: '32px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Đóng"
          >
            <CloseIcon size={14} color="var(--text-ink)" />
          </button>
        </div>

        {/* Heartfelt Note */}
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
          Cảm ơn bạn đã sử dụng <strong>AWS Mastery Hub</strong>! Mọi lời chúc phước lành hay một ly cà phê đều là nguồn động lực to lớn giúp mình tiếp tục cập nhật thêm kiến trúc, câu hỏi luyện thi và duy trì webapp hoàn toàn miễn phí cho cộng đồng!
        </p>

        {/* VietQR Code Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--text-ink)',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <img
            src={qrUrl}
            alt="Mã VietQR ACB STK 16601281"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              borderRadius: '4px',
              display: 'block'
            }}
          />

          {/* Bank Info Summary */}
          <div
            style={{
              width: '100%',
              background: 'var(--bg-card-warm)',
              border: '1px dashed var(--border-dashed)',
              padding: '10px 14px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12.5px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <span className="mono" style={{ color: 'var(--text-sepia)' }}>Ngân hàng:</span>
              <strong style={{ color: 'var(--text-ink)' }}>ACB (Ngân hàng Á Châu)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <span className="mono" style={{ color: 'var(--text-sepia)' }}>Số tài khoản:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <code className="mono" style={{ fontSize: '14px', fontWeight: 800, color: '#8A5A2B' }}>
                  16601281
                </code>
                <button
                  type="button"
                  onClick={handleCopyStk}
                  style={{
                    background: copied ? '#2E7D32' : 'var(--text-ink)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copied ? <CheckIcon size={11} color="#FFFFFF" /> : <CopyIcon size={11} color="#FFFFFF" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép STK'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <span className="mono" style={{ color: 'var(--text-sepia)' }}>Nội dung gợi ý:</span>
              <span className="mono" style={{ fontSize: '11.5px', color: 'var(--text-ink)' }}>
                Ban phuoc lanh AWS Hub
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-sepia)' }}>
          <HeartIcon size={13} color="#C0392B" />
          <span>Chúc bạn học tập hiệu quả và sớm đỗ chứng chỉ AWS mong muốn!</span>
        </div>
      </div>
    </div>
  );
};
