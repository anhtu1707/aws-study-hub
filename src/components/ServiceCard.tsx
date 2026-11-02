import React, { useState, useEffect } from 'react';
import { AWSService, LearningStatus } from '../types';
import { DockerIcon, ToolsIcon, SpeakerIcon, StopIcon } from './Icons';
import { speakStructuredText, buildCardSpeech, subscribeSpeech } from '../utils/speech';

interface ServiceCardProps {
  service: AWSService;
  status: LearningStatus;
  onStatusChange: (newStatus: LearningStatus) => void;
  onSelect: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  status,
  onStatusChange,
  onSelect
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return subscribeSpeech((speakingId) => {
      setIsSpeaking(speakingId === service.id);
    });
  }, [service.id]);

  const nextStatusMap: Record<LearningStatus, LearningStatus> = {
    not_started: 'in_progress',
    in_progress: 'mastered',
    mastered: 'not_started'
  };

  const statusConfig = {
    not_started: {
      label: 'Chưa học',
      bg: '#F5EFEB',
      color: '#73675C',
      border: '#D8CAB8'
    },
    in_progress: {
      label: 'Đang ôn',
      bg: '#EAF0F8',
      color: '#1D588F',
      border: '#AEC7E4'
    },
    mastered: {
      label: 'Đã thuộc',
      bg: '#141210',
      color: '#FFFFFF',
      border: '#141210'
    }
  }[status];

  return (
    <article
      className="torn-bottom paper-shadow paper-shadow-hover"
      onClick={onSelect}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderBottom: 'none',
        padding: '24px 22px 30px 22px',
        borderRadius: '3px 3px 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Corner Tape Accent */}
      <div
        className="washi-tape"
        style={{
          position: 'absolute',
          top: '-10px',
          right: '28px',
          width: '64px',
          height: '20px',
          transform: 'rotate(1.5deg)'
        }}
      />

      {/* Card Header: Category, Levels & Status Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            className="mono"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              background: 'var(--bg-card-warm)',
              border: '1px solid var(--border-dashed)',
              color: 'var(--text-charcoal)',
              padding: '2px 7px',
              borderRadius: '2px'
            }}
          >
            {service.categoryLabel}
          </span>

          {service.levels.slice(0, 2).map((lvl) => (
            <span
              key={lvl}
              className="mono stamp-badge stamp-dark"
              style={{ fontSize: '9.5px', padding: '2px 5px' }}
            >
              {lvl}
            </span>
          ))}

          {service.freeTier && (
            <span
              className="mono"
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#2E7D32',
                border: '1px dashed #2E7D32',
                padding: '1px 5px',
                borderRadius: '2px'
              }}
            >
              FREE
            </span>
          )}

          {service.dockerLab && (
            <span
              className="mono"
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#1D588F',
                border: '1px solid #1D588F',
                background: '#EDF4FC',
                padding: '2px 5px',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <DockerIcon size={11} color="#1D588F" />
              DOCKER LAB
            </span>
          )}

          <span
            className="mono"
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              color: '#8A5A2B',
              border: '1px dashed #8A5A2B',
              background: '#FAF6EE',
              padding: '2px 5px',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ToolsIcon size={10} color="#8A5A2B" />
            THAO TÁC
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Hands-Free Text to Speech Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speakStructuredText(service.id, buildCardSpeech(service), `${service.code} • ${service.name}`);
            }}
            title={isSpeaking ? 'Bấm để dừng giọng đọc' : 'Nghe giọng đọc tóm tắt (Rảnh tay)'}
            style={{
              border: isSpeaking ? '1px solid #C0392B' : '1px solid var(--border-dashed)',
              background: isSpeaking ? '#FDF2F0' : 'var(--bg-card-warm)',
              color: isSpeaking ? '#C0392B' : 'var(--text-ink)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            aria-label={isSpeaking ? 'Dừng đọc' : 'Nghe tóm tắt'}
          >
            {isSpeaking ? <StopIcon size={11} color="#C0392B" /> : <SpeakerIcon size={11} color="var(--text-ink)" />}
            <span>{isSpeaking ? 'Dừng' : 'Nghe'}</span>
          </button>

          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(nextStatusMap[status]);
            }}
            title="Nhấn để đổi trạng thái học tập"
            style={{
              border: `1px solid ${statusConfig.border}`,
              background: statusConfig.bg,
              color: statusConfig.color,
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {status === 'mastered' && (
              <svg style={{ width: '12px', height: '12px', stroke: 'currentColor', fill: 'none', strokeWidth: 3 }} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {statusConfig.label}
          </button>
        </div>
      </div>

      {/* Service Name & Acronym */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 className="mono" style={{ fontSize: '22px', margin: 0, color: 'var(--text-ink)' }}>
            {service.code}
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-sepia)' }}>
            {service.name}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
          {service.summary}
        </p>
      </div>

      {/* Sticky Exam Tip Note */}
      <div
        style={{
          background: 'var(--bg-card-warm)',
          borderLeft: '3px solid var(--text-ink)',
          borderTop: '1px dashed var(--border-dashed)',
          borderBottom: '1px dashed var(--border-dashed)',
          borderRight: '1px dashed var(--border-dashed)',
          padding: '10px 12px',
          fontSize: '12px',
          lineHeight: 1.5,
          color: 'var(--text-charcoal)'
        }}
      >
        <strong style={{ color: 'var(--text-ink)' }}>Mẹo thi:</strong> {service.examTip}
      </div>

      {/* Card Footer: Related services tag & Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px dashed var(--border-light)',
          paddingTop: '12px',
          marginTop: 'auto'
        }}
      >
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Cùng: {service.relatedServices.slice(0, 3).join(', ')}
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-ink)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Hồ sơ &amp; Thao tác
          <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </article>
  );
};
