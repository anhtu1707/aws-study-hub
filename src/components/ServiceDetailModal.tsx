import React, { useState, useEffect } from 'react';
import { AWSService, LearningStatus } from '../types';
import { getHandsOnGuide } from '../data/handsOnGuides';
import { getDetailedExamAndPricing } from '../data/examAndPricingDetails';
import { speakStructuredText, buildDetailedSpeech, subscribeSpeech, stopSpeech } from '../utils/speech';
import {
  DockerIcon,
  ToolsIcon,
  TargetIcon,
  LightbulbIcon,
  WarningIcon,
  ConsoleIcon,
  TerminalIcon,
  CheckIcon,
  TrashIcon,
  CloseIcon,
  CopyIcon,
  DollarIcon,
  KeyIcon,
  ExternalLinkIcon,
  SpeakerIcon,
  StopIcon
} from './Icons';

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
  const [handsOnMode, setHandsOnMode] = useState<'console' | 'cli'>('console');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return subscribeSpeech((speakingId) => {
      setIsSpeaking(speakingId === `modal-${service.id}`);
    });
  }, [service.id]);

  const handsOn = service.handsOn || getHandsOnGuide(service);
  const intelligence = getDetailedExamAndPricing(service);

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
      onClick={() => {
        stopSpeech();
        onClose();
      }}
    >
      <div
        className="torn-both"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
              {service.freeTier && (
                <span className="stamp-badge" style={{ fontSize: '10px', background: '#E8F5E9', color: '#2E7D32', border: '1px dashed #2E7D32' }}>
                  FREE TIER
                </span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {service.name}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => speakStructuredText(`modal-${service.id}`, buildDetailedSpeech(service), `Hồ sơ ${service.code} • ${service.name}`)}
              title={isSpeaking ? 'Bấm để dừng giọng đọc' : 'Nghe toàn bộ hồ sơ (Bản chất, Mẹo thi & Bẫy chi phí) khi rảnh tay'}
              style={{
                border: isSpeaking ? '1px solid #C0392B' : '1px solid var(--text-ink)',
                background: isSpeaking ? '#FDF2F0' : 'var(--bg-card-warm)',
                color: isSpeaking ? '#C0392B' : 'var(--text-ink)',
                padding: '7px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              aria-label="Nghe đọc hồ sơ âm thanh"
            >
              {isSpeaking ? <StopIcon size={12} color="#C0392B" /> : <SpeakerIcon size={12} color="var(--text-ink)" />}
              <span>{isSpeaking ? 'Dừng đọc' : 'Nghe Hồ Sơ (Audio)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              style={{
                border: '1px solid var(--text-ink)',
                background: 'var(--bg-card-warm)',
                color: 'var(--text-ink)',
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
              <CloseIcon size={14} color="var(--text-ink)" />
            </button>
          </div>
        </div>

        {/* Quick Jump Navigation Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 14px',
            background: 'var(--bg-card-warm)',
            border: '1px solid var(--border-dashed)',
            borderRadius: '2px',
            alignItems: 'center'
          }}
        >
          <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Điều hướng nhanh:
          </span>
          <button
            type="button"
            onClick={() => document.getElementById('modal-section-exam')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--text-ink)',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-ink)'
            }}
          >
            <LightbulbIcon size={12} color="var(--text-sepia)" />
            Mẹo Thi Sát Đề &amp; Bẫy Câu Hỏi
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('modal-section-pricing')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #8A5A2B',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#8A5A2B'
            }}
          >
            <DollarIcon size={12} color="#8A5A2B" />
            Cạm Bẫy Chi Phí (FinOps)
          </button>
          {service.dockerLab && (
            <button
              type="button"
              onClick={() => document.getElementById('modal-section-docker')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-dashed)',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--text-charcoal)'
              }}
            >
              <DockerIcon size={12} color="var(--text-charcoal)" />
              Lab Docker Cục Bộ
            </button>
          )}
          <button
            type="button"
            onClick={() => document.getElementById('modal-section-handson')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-dashed)',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-charcoal)'
            }}
          >
            <ToolsIcon size={12} color="var(--text-charcoal)" />
            Hướng Dẫn Thao Tác (Hands-on)
          </button>
        </div>

        {/* Full Architectural Explanation */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TargetIcon size={14} color="var(--text-ink)" />
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)', textTransform: 'uppercase' }}>
              Khi nào nên chọn dịch vụ này trong kiến trúc thực tế?
            </span>
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-charcoal)', lineHeight: 1.55 }}>
            {service.whenToChoose}
          </div>
        </div>

        {/* SECTION 1: MẸO THI SÁT ĐỀ & BẪY CÂU HỎI (EXAM INTELLIGENCE) */}
        <div
          id="modal-section-exam"
          style={{
            background: '#FFFDF9',
            border: '1.5px solid var(--text-ink)',
            borderLeft: '4px solid var(--text-ink)',
            borderRadius: '3px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="stamp-badge stamp-dark" style={{ fontSize: '11px', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LightbulbIcon size={13} color="#FFFFFF" />
              MẸO THI SÁT ĐỀ &amp; BẪY CÂU HỎI (EXAM INTELLIGENCE)
            </span>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Trọng tâm các kỳ thi AWS SAA • SAP • Specialty
            </span>
          </div>

          {/* Core concept */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-sepia)', textTransform: 'uppercase' }}>
              Bản chất cốt lõi câu hỏi thi kiểm tra:
            </span>
            <div style={{ fontSize: '13.5px', color: 'var(--text-ink)', lineHeight: 1.55, fontWeight: 500 }}>
              {intelligence.exam.coreConcept}
            </div>
          </div>

          {/* Keywords to spot in questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-sepia)', textTransform: 'uppercase' }}>
              Từ khóa "vàng" nhận diện bài toán trong đề thi:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {intelligence.exam.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="mono"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'var(--bg-card-warm)',
                    border: '1px solid var(--border-dashed)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    color: 'var(--text-ink)'
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Common Exam Traps & Distractors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WarningIcon size={13} color="#C0392B" />
              <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#C0392B', textTransform: 'uppercase' }}>
                Cạm bẫy câu hỏi thường gặp &amp; Cách loại trừ đáp án nhiễu:
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {intelligence.exam.trapsAndDistractors.map((trap, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    borderLeft: '3px solid #C0392B',
                    border: '1px solid #F5D3CE',
                    borderLeftWidth: '3px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--text-charcoal)'
                  }}
                >
                  {trap}
                </div>
              ))}
            </div>
          </div>

          {/* 3-Second Decision Rule */}
          <div
            style={{
              background: '#F0F7F2',
              border: '1px solid #C3E6CB',
              borderLeft: '3px solid #2E7D32',
              padding: '10px 14px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <CheckIcon size={14} color="#2E7D32" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#155724', lineHeight: 1.5 }}>
              <strong>Quy tắc 3 giây chọn đáp án:</strong> {intelligence.exam.decisionRule}
            </div>
          </div>
        </div>

        {/* SECTION 2: CẠM BẪY CHI PHÍ & CHIẾN THUẬT FINOPS */}
        <div
          id="modal-section-pricing"
          style={{
            background: '#FAF6EE',
            border: '1.5px solid #8A5A2B',
            borderLeft: '4px solid #8A5A2B',
            borderRadius: '3px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="stamp-badge" style={{ fontSize: '11px', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#8A5A2B', color: '#FFFFFF' }}>
              <DollarIcon size={13} color="#FFFFFF" />
              CẠM BẪY CHI PHÍ &amp; CHIẾN THUẬT FINOPS (PRICING GOTCHAS)
            </span>
            <span className="mono" style={{ fontSize: '10.5px', color: '#8A5A2B' }}>
              Kiểm soát ngân sách &amp; Tránh phát sinh sốc hóa đơn
            </span>
          </div>

          {/* Billing Model */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#8A5A2B', textTransform: 'uppercase' }}>
              Mô hình tính cước cốt lõi:
            </span>
            <div style={{ fontSize: '13.5px', color: 'var(--text-ink)', lineHeight: 1.55 }}>
              {intelligence.pricing.billingModel}
            </div>
          </div>

          {/* Hidden Costs Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WarningIcon size={13} color="#8A5A2B" />
              <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#8A5A2B', textTransform: 'uppercase' }}>
                Các loại chi phí ngầm dễ gây sốc hóa đơn (Hidden Costs):
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {intelligence.pricing.hiddenCosts.map((cost, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    borderLeft: '3px solid #8A5A2B',
                    border: '1px solid #EADBCE',
                    borderLeftWidth: '3px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--text-charcoal)'
                  }}
                >
                  {cost}
                </div>
              ))}
            </div>
          </div>

          {/* Free Tier Rule & Thresholds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyIcon size={13} color="var(--text-ink)" />
              <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-sepia)', textTransform: 'uppercase' }}>
                Quy tắc Free Tier &amp; Ngưỡng miễn phí:
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-charcoal)', lineHeight: 1.5, background: '#FFFFFF', padding: '8px 12px', borderRadius: '2px', border: '1px solid var(--border-dashed)' }}>
              {intelligence.pricing.freeTierRules}
            </div>
          </div>

          {/* Cost Optimization Tactics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase' }}>
              Chiến thuật cắt giảm chi phí tối đa (FinOps Tactics):
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {intelligence.pricing.costOptimizationTactics.map((tactic, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: '#1E4620'
                  }}
                >
                  <CheckIcon size={13} color="#2E7D32" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Docker Lab Suite (If available for local practice) */}
        {service.dockerLab && (
          <div
            id="modal-section-docker"
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
              <span className="stamp-badge stamp-dark" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <DockerIcon size={12} color="#FFFFFF" />
                PHÒNG LAB DOCKER CỤC BỘ (THỰC HÀNH TEST)
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
                    style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-dashed)', padding: '2px 6px', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CopyIcon size={11} />
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
                    style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-dashed)', padding: '2px 6px', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CopyIcon size={11} />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-platform command note */}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '2px', border: '1px dashed var(--border-dashed)' }}>
              <span>
                💡 Lệnh Docker chuẩn (Linux / Mac / Windows): <code className="mono" style={{ color: 'var(--text-ink)', fontWeight: 700 }}>docker compose --profile {service.dockerLab.profile} up -d</code>
              </span>
              <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-sepia)' }}>
                Yêu cầu: Đã cài Docker &amp; Clone repo về máy
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-sepia)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Endpoint: <code className="mono" style={{ color: 'var(--text-ink)', fontWeight: 600 }}>{service.dockerLab.endpoint}</code></span>
                {service.dockerLab.guiUrl && (
                  <span style={{ marginLeft: '10px' }}>
                    <a href={service.dockerLab.guiUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 700, color: 'var(--text-ink)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Mở Web Console <ExternalLinkIcon size={11} />
                    </a>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  onStatusChange('mastered');
                  alert('Đã lưu tiến độ: Dịch vụ này đã được đánh dấu là ĐÃ THUỘC!');
                }}
                style={{
                  background: 'var(--text-ink)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '7px 14px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckIcon size={13} color="#FFFFFF" />
                Đã Hoàn Thành Lab &amp; Lưu Tiến Độ
              </button>
            </div>
          </div>
        )}

        {/* Hands-On Practical Operation Station */}
        <div
          id="modal-section-handson"
          style={{
            background: 'var(--bg-card-warm)',
            border: '2px dashed var(--text-ink)',
            padding: '20px 22px',
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Header & Mode Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="stamp-badge stamp-dark" style={{ fontSize: '11px', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ToolsIcon size={12} color="#FFFFFF" />
                HƯỚNG DẪN THAO TÁC THỰC CHIẾN (HANDS-ON)
              </span>
              <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                Console &amp; CLI
              </span>
            </div>

            {/* Switch Console vs CLI */}
            <div style={{ display: 'flex', background: '#EAE4DC', padding: '2px', borderRadius: '3px' }}>
              <button
                type="button"
                onClick={() => setHandsOnMode('console')}
                style={{
                  background: handsOnMode === 'console' ? 'var(--text-ink)' : 'transparent',
                  color: handsOnMode === 'console' ? '#FFFFFF' : 'var(--text-ink)',
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                <ConsoleIcon size={12} color={handsOnMode === 'console' ? '#FFFFFF' : 'var(--text-ink)'} />
                AWS Console (GUI)
              </button>
              <button
                type="button"
                onClick={() => setHandsOnMode('cli')}
                style={{
                  background: handsOnMode === 'cli' ? 'var(--text-ink)' : 'transparent',
                  color: handsOnMode === 'cli' ? '#FFFFFF' : 'var(--text-ink)',
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                <TerminalIcon size={12} color={handsOnMode === 'cli' ? '#FFFFFF' : 'var(--text-ink)'} />
                AWS CLI (Terminal)
              </button>
            </div>
          </div>

          {/* Title & Objective */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-ink)' }}>
              {handsOn.title}
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text-charcoal)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <TargetIcon size={13} color="var(--text-ink)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Mục tiêu thao tác:</strong> {handsOn.objective}</span>
            </div>
          </div>

          {/* Steps Display */}
          {handsOnMode === 'console' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-sepia)', textTransform: 'uppercase' }}>
                Quy trình thao tác từng bước trên AWS Console:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {handsOn.consoleSteps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--border-dashed)',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      fontSize: '13px',
                      color: 'var(--text-ink)',
                      lineHeight: 1.6,
                      display: 'flex',
                      gap: '10px'
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontWeight: 800,
                        color: 'var(--text-ink)',
                        background: 'var(--bg-card-warm)',
                        padding: '1px 6px',
                        borderRadius: '2px',
                        alignSelf: 'flex-start',
                        fontSize: '11px'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      {step.replace(/^\d+\.\s*/, '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-sepia)', textTransform: 'uppercase' }}>
                  Chuỗi lệnh AWS CLI thao tác trực tiếp:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(handsOn.cliSteps.join('\n'));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-dashed)',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CopyIcon size={11} />
                  {copied ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ lệnh'}
                </button>
              </div>

              <div
                className="mono"
                style={{
                  background: 'var(--text-ink)',
                  color: '#E6E4E0',
                  fontSize: '12px',
                  padding: '14px 16px',
                  borderRadius: '3px',
                  lineHeight: 1.6,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {handsOn.cliSteps.join('\n')}
              </div>
            </div>
          )}

          {/* Verification & Cleanup Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', paddingTop: '4px' }}>
            <div
              style={{
                background: '#F0F7F2',
                border: '1px solid #D1E7DD',
                borderLeft: '3px solid #2E7D32',
                padding: '10px 12px',
                borderRadius: '2px',
                fontSize: '12.5px',
                lineHeight: 1.5,
                color: '#155724'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <CheckIcon size={13} color="#2E7D32" />
                <strong>Dấu hiệu kiểm tra thành công (Verification):</strong>
              </div>
              <div>{handsOn.verification}</div>
            </div>

            {handsOn.cleanup && (
              <div
                style={{
                  background: '#FFF8E6',
                  border: '1px solid #FFEBAA',
                  borderLeft: '3px solid #B78103',
                  padding: '10px 12px',
                  borderRadius: '2px',
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  color: '#7A5200'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <TrashIcon size={13} color="#B78103" />
                  <strong>Dọn dẹp tài nguyên (Tránh phát sinh phí):</strong>
                </div>
                <div>{handsOn.cleanup}</div>
              </div>
            )}
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
