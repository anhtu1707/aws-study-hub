import { useState, useEffect, useMemo } from 'react';
import { AWS_SERVICES } from './data/services';
import { AWSCategory, ExamLevel, LearningStatus, AWSService } from './types';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { QuizView } from './components/QuizView';
import { ArchitectureView } from './components/ArchitectureView';
import { SearchIcon } from './components/Icons';

export function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'quiz' | 'patterns'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AWSCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<ExamLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<LearningStatus | 'all'>('all');
  const [onlyFreeTier, setOnlyFreeTier] = useState(false);
  const [selectedService, setSelectedService] = useState<AWSService | null>(null);

  // LocalStorage state for progress
  const [statusMap, setStatusMap] = useState<Record<string, LearningStatus>>(() => {
    try {
      const saved = localStorage.getItem('aws_study_status_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial learned services
    return {
      ec2: 'mastered',
      s3: 'mastered',
      lambda: 'mastered',
      vpc: 'in_progress',
      iam: 'mastered',
      rds: 'in_progress',
      dynamodb: 'in_progress'
    };
  });

  // LocalStorage state for notes
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('aws_study_notes_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aws_study_status_v1', JSON.stringify(statusMap));
    } catch {
      // ignore
    }
  }, [statusMap]);

  useEffect(() => {
    try {
      localStorage.setItem('aws_study_notes_v1', JSON.stringify(notesMap));
    } catch {
      // ignore
    }
  }, [notesMap]);

  // Statistics
  const learnedCount = useMemo(() => {
    return Object.values(statusMap).filter((st) => st === 'mastered').length;
  }, [statusMap]);

  const inProgressCount = useMemo(() => {
    return Object.values(statusMap).filter((st) => st === 'in_progress').length;
  }, [statusMap]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: AWS_SERVICES.length };
    AWS_SERVICES.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered services
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return AWS_SERVICES.filter((s) => {
      // Category
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      // Level
      if (selectedLevel !== 'all' && !s.levels.includes(selectedLevel)) {
        return false;
      }
      // Status
      const currentSt = statusMap[s.id] || 'not_started';
      if (selectedStatus !== 'all' && currentSt !== selectedStatus) {
        return false;
      }
      // Free Tier
      if (onlyFreeTier && !s.freeTier) {
        return false;
      }
      // Search
      if (q) {
        const text = `${s.code} ${s.name} ${s.summary} ${s.whenToChoose} ${s.examTip} ${s.categoryLabel}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedStatus, onlyFreeTier, statusMap]);

  // Handlers
  const handleStatusChange = (serviceId: string, newStatus: LearningStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [serviceId]: newStatus
    }));
  };

  const handleNoteChange = (serviceId: string, note: string) => {
    setNotesMap((prev) => ({
      ...prev,
      [serviceId]: note
    }));
  };

  const handleExport = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      statusMap,
      notesMap
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-study-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (data && typeof data === 'object') {
          if (data.statusMap && typeof data.statusMap === 'object') {
            setStatusMap(data.statusMap);
          }
          if (data.notesMap && typeof data.notesMap === 'object') {
            setNotesMap(data.notesMap);
          }
          alert('Khôi phục dữ liệu tiến độ và ghi chú thành công!');
        }
      } catch (err) {
        alert('File JSON không hợp lệ hoặc bị lỗi định dạng.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập và ghi chú?')) {
      setStatusMap({});
      setNotesMap({});
    }
  };

  const handleSelectServiceCode = (code: string) => {
    const found = AWS_SERVICES.find((s) => s.code.toLowerCase() === code.toLowerCase() || s.id.toLowerCase() === code.toLowerCase());
    if (found) {
      setSelectedService(found);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: '24px 20px 80px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ width: '100%', maxWidth: '1340px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Top Header Banner */}
        <Header
          totalServices={AWS_SERVICES.length}
          learnedCount={learnedCount}
          inProgressCount={inProgressCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />

        {/* Tab 1: Catalog */}
        {activeTab === 'catalog' && (
          <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onlyFreeTier={onlyFreeTier}
              setOnlyFreeTier={setOnlyFreeTier}
              categoryCounts={categoryCounts}
            />

            {/* Filter Result Counter */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px dashed var(--border-dashed)',
                paddingBottom: '10px',
                fontSize: '13px',
                color: 'var(--text-sepia)'
              }}
            >
              <div>
                Đang hiển thị: <strong style={{ color: 'var(--text-ink)' }}>{filteredServices.length}</strong> dịch vụ phù hợp
              </div>
              <div style={{ fontSize: '12px' }}>
                Gợi ý: Nhấn vào thẻ để xem phân tích chi tiết &amp; lưu ghi chú
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '26px'
                }}
              >
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    status={statusMap[service.id] || 'not_started'}
                    onStatusChange={(newSt) => handleStatusChange(service.id, newSt)}
                    onSelect={() => setSelectedService(service)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="torn-both"
                style={{
                  background: 'var(--bg-card)',
                  padding: '48px 24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <SearchIcon size={32} color="var(--text-sepia)" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Không tìm thấy dịch vụ AWS nào phù hợp</h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-sepia)' }}>
                  Hãy thử gõ từ khóa khác hoặc bấm nút "Tất cả" trên thanh phân hệ.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSelectedStatus('all');
                    setOnlyFreeTier(false);
                  }}
                  style={{
                    background: 'var(--text-ink)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>
        )}

        {/* Tab 2: Flashcards Quiz */}
        {activeTab === 'quiz' && <QuizView />}

        {/* Tab 3: Architecture Blueprints */}
        {activeTab === 'patterns' && (
          <ArchitectureView onSelectServiceCode={handleSelectServiceCode} />
        )}

        {/* Detail Modal */}
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            status={statusMap[selectedService.id] || 'not_started'}
            note={notesMap[selectedService.id] || ''}
            onStatusChange={(newSt) => handleStatusChange(selectedService.id, newSt)}
            onNoteChange={(note) => handleNoteChange(selectedService.id, note)}
            onClose={() => setSelectedService(null)}
          />
        )}

        {/* Bottom Footer Strip */}
        <footer
          className="torn-top"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderTop: 'none',
            padding: '24px 30px',
            borderRadius: '0 0 4px 4px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 16px rgba(45,35,25,0.04)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-ink)' }}>
              AWS Services Study Blueprint
            </span>
          </div>

          <div
            className="mono"
            style={{ display: 'flex', gap: '14px', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-sepia)' }}
          >
            <span>{AWS_SERVICES.length} Dịch vụ</span>
            <span>•</span>
            <span>15 Phân hệ</span>
            <span>•</span>
            <span>CLF/SAA/SAP/Specialty</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
