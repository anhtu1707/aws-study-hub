import React, { useState, useEffect } from 'react';
import {
  subscribeSpeechStatus,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
  setSpeechRate,
  setSpeechEngine,
  SpeechStatus
} from '../utils/speech';
import {
  SpeakerIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CloseIcon
} from './Icons';

export const AudioPlayerBar: React.FC = () => {
  const [status, setStatus] = useState<SpeechStatus>({
    speakingId: null,
    isPlaying: false,
    title: '',
    engine: 'google',
    rate: 1.0
  });

  useEffect(() => {
    return subscribeSpeechStatus((newStatus) => {
      setStatus(newStatus);
    });
  }, []);

  if (!status.speakingId) return null;

  return (
    <div
      className="torn-both paper-shadow"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 98,
        width: 'calc(100% - 24px)',
        maxWidth: '720px',
        boxSizing: 'border-box',
        background: '#FFFDF9',
        border: '1.5px solid var(--text-ink)',
        borderLeft: '5px solid var(--text-ink)',
        borderRadius: '3px',
        padding: '10px clamp(12px, 3vw, 18px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 10px 35px rgba(20, 15, 10, 0.25)'
      }}
      role="region"
      aria-label="Trình phát âm thanh rảnh tay"
    >
      {/* Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 180px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '2px',
            background: status.isPlaying ? 'var(--text-ink)' : 'var(--bg-card-warm)',
            color: status.isPlaying ? '#FFFFFF' : 'var(--text-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid var(--border-dashed)'
          }}
        >
          <SpeakerIcon size={16} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="stamp-badge stamp-dark"
              style={{ fontSize: '9px', padding: '1px 5px', letterSpacing: '0.5px' }}
            >
              {status.isPlaying ? 'ĐANG PHÁT AUDIO' : 'TẠM DỪNG'}
            </span>
            <span
              className="mono"
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: status.engine === 'google' ? '#2E7D32' : 'var(--text-muted)'
              }}
            >
              {status.engine === 'google' ? '● Giọng Chuẩn Tiếng Việt (HD)' : '○ Giọng Trình Duyệt'}
            </span>
          </div>

          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {status.title || 'Bài học âm thanh AWS'}
          </span>
        </div>
      </div>

      {/* Controls & Options */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={status.isPlaying ? pauseSpeech : resumeSpeech}
          style={{
            background: 'var(--text-ink)',
            color: '#FFFFFF',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={status.isPlaying ? 'Tạm dừng đọc' : 'Tiếp tục phát'}
        >
          {status.isPlaying ? <PauseIcon size={12} color="#FFFFFF" /> : <PlayIcon size={12} color="#FFFFFF" />}
          <span>{status.isPlaying ? 'Tạm dừng' : 'Tiếp tục'}</span>
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={stopSpeech}
          style={{
            background: '#FDF2F0',
            color: '#C0392B',
            border: '1px solid #F5D3CE',
            padding: '6px 10px',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
          title="Dừng hẳn bài học"
        >
          <StopIcon size={11} color="#C0392B" />
          <span>Dừng</span>
        </button>

        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-card-warm)', padding: '2px 4px', borderRadius: '2px', border: '1px solid var(--border-dashed)' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '2px' }}>
            Tốc độ:
          </span>
          {[0.9, 1.0, 1.15].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setSpeechRate(spd)}
              className="mono"
              style={{
                fontSize: '10px',
                fontWeight: status.rate === spd ? 700 : 500,
                background: status.rate === spd ? 'var(--text-ink)' : 'transparent',
                color: status.rate === spd ? '#FFFFFF' : 'var(--text-ink)',
                border: 'none',
                padding: '2px 5px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Engine Switcher */}
        <button
          type="button"
          onClick={() => setSpeechEngine(status.engine === 'google' ? 'browser' : 'google')}
          title="Chuyển đổi giữa Giọng chuẩn Google (cực rõ chữ) và Giọng máy offline"
          style={{
            background: 'transparent',
            border: '1px dashed var(--border-dashed)',
            fontSize: '10.5px',
            color: 'var(--text-charcoal)',
            padding: '4px 8px',
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          Đổi giọng: {status.engine === 'google' ? 'Google HD' : 'System'}
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={stopSpeech}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Đóng thanh phát âm thanh"
        >
          <CloseIcon size={13} color="var(--text-charcoal)" />
        </button>
      </div>
    </div>
  );
};
