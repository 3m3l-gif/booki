
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOverview, 
  WorldSetting, 
  ProfileField, 
  Character, 
  Relationship, 
  TimelineEvent, 
  ActiveTab,
  BookProject
} from './types';
import RelationshipMap from './components/RelationshipMap';

const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  Share2: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>,
  Grip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>,
};

const INITIAL_PROJECT_DATA = {
  overview: { title: '새로운 이야기', author: '작가', publisher: '', startDate: '', endDate: '' },
  settings: [],
  profileFields: [
    { id: '1', label: '나이', type: 'number' },
    { id: '2', label: '성격', type: 'text' },
    { id: '3', label: '목표', type: 'text' }
  ],
  characters: [],
  relationships: [],
  timeline: []
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<BookProject[]>(() => {
    const saved = localStorage.getItem('booki_all_projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const saved = localStorage.getItem('booki_active_id');
    return saved || null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(activeProjectId ? 'overview' : 'projects');

  // Persistence
  useEffect(() => {
    localStorage.setItem('booki_all_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('booki_active_id', activeProjectId);
    } else {
      localStorage.removeItem('booki_active_id');
    }
  }, [activeProjectId]);

  const currentProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  // Content State Proxies
  const [searchQuery, setSearchQuery] = useState('');
  const [settingSearchQuery, setSettingSearchQuery] = useState('');
  const [showProfileConfig, setShowProfileConfig] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [expandedTimelineIds, setExpandedTimelineIds] = useState<string[]>([]);

  // Project Handlers
  const createNewProject = () => {
    const newProject: BookProject = {
      id: Date.now().toString(),
      ...JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA)),
      lastModified: Date.now()
    };
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setActiveTab('overview');
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말로 이 책을 삭제하시겠습니까? 모든 데이터가 사라집니다.')) return;
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setActiveTab('projects');
    }
  };

  const updateCurrentProject = (updates: Partial<BookProject>) => {
    if (!activeProjectId) return;
    setProjects(projects.map(p => p.id === activeProjectId ? { ...p, ...updates, lastModified: Date.now() } : p));
  };

  // Sub-handlers for current project
  const updateOverview = (field: keyof BookOverview, value: string) => {
    if (!currentProject) return;
    updateCurrentProject({ overview: { ...currentProject.overview, [field]: value } });
  };

  const addWorldSetting = (parentId?: string) => {
    if (!currentProject) return;
    const newSetting: WorldSetting = { id: Date.now().toString(), title: '새 항목', content: '', children: [] };
    const settings = [...currentProject.settings];

    if (!parentId) {
      updateCurrentProject({ settings: [...settings, newSetting] });
    } else {
      const updateChildren = (list: WorldSetting[]): WorldSetting[] => {
        return list.map(item => {
          if (item.id === parentId) return { ...item, children: [...item.children, newSetting] };
          if (item.children.length > 0) return { ...item, children: updateChildren(item.children) };
          return item;
        });
      };
      updateCurrentProject({ settings: updateChildren(settings) });
    }
  };

  const updateWorldSetting = (id: string, updates: Partial<WorldSetting>) => {
    if (!currentProject) return;
    const updateById = (list: WorldSetting[]): WorldSetting[] => {
      return list.map(item => {
        if (item.id === id) return { ...item, ...updates };
        return { ...item, children: updateById(item.children) };
      });
    };
    updateCurrentProject({ settings: updateById(currentProject.settings) });
  };

  const removeWorldSetting = (id: string) => {
    if (!currentProject) return;
    const removeById = (list: WorldSetting[]): WorldSetting[] => {
      return list.filter(item => item.id !== id).map(item => ({ ...item, children: removeById(item.children) }));
    };
    updateCurrentProject({ settings: removeById(currentProject.settings) });
  };

  const addCharacter = () => {
    if (!currentProject) return;
    const newChar: Character = { id: Date.now().toString(), name: '새 인물', profileData: {}, order: currentProject.characters.length };
    updateCurrentProject({ characters: [...currentProject.characters, newChar] });
    setEditingCharacter(newChar);
  };

  const addTimelineEvent = () => {
    if (!currentProject) return;
    const newEvent: TimelineEvent = { id: Date.now().toString(), period: '시기 1', event: '새로운 사건', details: '', color: '#6366f1', order: currentProject.timeline.length };
    updateCurrentProject({ timeline: [...currentProject.timeline, newEvent] });
  };

  const moveTimelineEvent = (id: string, direction: 'up' | 'down') => {
    if (!currentProject) return;
    const list = [...currentProject.timeline];
    const idx = list.findIndex(t => t.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === list.length - 1)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [list[idx], list[targetIdx]] = [list[targetIdx], list[idx]];
    updateCurrentProject({ timeline: list.map((t, i) => ({ ...t, order: i })) });
  };

  const filteredCharacters = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.characters
      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  }, [currentProject, searchQuery]);

  // 연표 그룹화 로직
  const groupedTimeline = useMemo(() => {
    if (!currentProject) return [];
    const groups: Record<string, TimelineEvent[]> = {};
    const sortedTimeline = [...currentProject.timeline].sort((a, b) => a.order - b.order);
    
    sortedTimeline.forEach(event => {
      const key = event.period || '미분류';
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    // 기존 리스트 순서를 유지하기 위해 각 그룹의 첫 번째 사건의 order를 기준으로 정렬된 시기 목록 반환
    const uniquePeriodsInOrder: string[] = [];
    sortedTimeline.forEach(e => {
      const key = e.period || '미분류';
      if (!uniquePeriodsInOrder.includes(key)) uniquePeriodsInOrder.push(key);
    });

    return uniquePeriodsInOrder.map(period => ({
      period,
      events: groups[period]
    }));
  }, [currentProject?.timeline]);

  const filteredSettings = useMemo(() => {
    if (!currentProject) return [];
    if (!settingSearchQuery.trim()) return currentProject.settings;
    
    const query = settingSearchQuery.toLowerCase();
    const filter = (nodes: WorldSetting[]): WorldSetting[] => {
      return nodes.reduce((acc: WorldSetting[], node) => {
        const match = node.title.toLowerCase().includes(query) || node.content.toLowerCase().includes(query);
        const filteredChildren = filter(node.children);
        
        if (match || filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        }
        return acc;
      }, []);
    };
    
    return filter(currentProject.settings);
  }, [currentProject?.settings, settingSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('projects')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">B</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">booki</h1>
        </div>
        
        {activeProjectId && currentProject && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 px-1">현재 작업 중인 책</p>
            <p className="font-semibold text-slate-700 truncate px-1">{currentProject.overview.title}</p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'projects' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Icons.Home /> 내 책장
          </button>
          
          {activeProjectId && (
            <>
              <div className="my-2 h-px bg-slate-100" />
              {[
                { id: 'overview', icon: Icons.Book, label: '개요' },
                { id: 'settings', icon: Icons.Settings, label: '세계관 설정' },
                { id: 'characters', icon: Icons.Users, label: '등장인물' },
                { id: 'relationships', icon: Icons.Share2, label: '관계도' },
                { id: 'timeline', icon: Icons.Calendar, label: '연표' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen scrollbar-hide">
        <div className="max-w-5xl mx-auto">
          
          {/* TAB: PROJECTS (BOOKSHELF) */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">내 책장</h2>
                  <p className="text-slate-500">정리하고 있는 이야기들을 한눈에 확인하세요</p>
                </div>
                <button 
                  onClick={createNewProject}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Icons.Plus /> 새 책 만들기
                </button>
              </header>

              {projects.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <Icons.Book />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">책장이 비어있습니다</h3>
                    <p className="text-slate-500">새로운 이야기를 추가하여 정리를 시작해보세요!</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { setActiveProjectId(p.id); setActiveTab('overview'); }}
                      className={`group bg-white p-6 rounded-3xl border-2 transition-all cursor-pointer hover:shadow-xl ${activeProjectId === p.id ? 'border-indigo-500' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-16 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400">
                          <Icons.Book />
                        </div>
                        <button 
                          onClick={(e) => deleteProject(p.id, e)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{p.overview.title || '제목 없음'}</h3>
                      <p className="text-slate-500 text-sm mb-4">{p.overview.author || '작가 미상'}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                        <span>인물 {p.characters.length}명</span>
                        <span>{new Date(p.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && currentProject && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-slate-800">책 개요</h2>
                <p className="text-slate-500 mt-1">프로젝트의 기본 정보를 입력하세요</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">제목</label>
                  <input 
                    type="text" 
                    value={currentProject.overview.title} 
                    onChange={(e) => updateOverview('title', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="예: 우주 연대기"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">저자</label>
                  <input 
                    type="text" 
                    value={currentProject.overview.author} 
                    onChange={(e) => updateOverview('author', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">출판사</label>
                  <input 
                    type="text" 
                    value={currentProject.overview.publisher} 
                    onChange={(e) => updateOverview('publisher', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">시작일</label>
                    <input 
                      type="date" 
                      value={currentProject.overview.startDate} 
                      onChange={(e) => updateOverview('startDate', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">종료일</label>
                    <input 
                      type="date" 
                      value={currentProject.overview.endDate} 
                      onChange={(e) => updateOverview('endDate', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB: WORLD BUILDING */}
          {activeTab === 'settings' && currentProject && (
            <div className="space-y-6">
              <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">세계관 설정</h2>
                  <p className="text-slate-500">이야기의 배경이 되는 세계를 구축하세요</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-64">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icons.Search />
                    </span>
                    <input 
                      type="text" 
                      placeholder="설정 검색..."
                      value={settingSearchQuery}
                      onChange={(e) => setSettingSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => addWorldSetting()} 
                    className="whitespace-nowrap bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    <Icons.Plus /> 상위 항목 추가
                  </button>
                </div>
              </header>
              <div className="space-y-4">
                {filteredSettings.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">항목이 없거나 검색 결과가 없습니다.</div>
                ) : (
                  filteredSettings.map(item => (
                    <WorldSettingCard 
                      key={item.id} 
                      item={item} 
                      onAddSub={() => addWorldSetting(item.id)}
                      onUpdate={(u) => updateWorldSetting(item.id, u)}
                      onDelete={() => removeWorldSetting(item.id)}
                      updateGlobalById={updateWorldSetting}
                      removeGlobalById={removeWorldSetting}
                      addGlobalSubById={addWorldSetting}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: CHARACTERS */}
          {activeTab === 'characters' && currentProject && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">등장인물</h2>
                  <p className="text-slate-500">인물들의 상세 프로필을 관리하세요</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-64">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icons.Search />
                    </span>
                    <input 
                      type="text" 
                      placeholder="인물 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setShowProfileConfig(true)}
                    className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Icons.Settings />
                  </button>
                  <button 
                    onClick={addCharacter}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    <Icons.Plus /> 인물 추가
                  </button>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map((char) => (
                  <div key={char.id} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 transition-all hover:shadow-md relative h-fit">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
                        {char.name.charAt(0)}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingCharacter(char)} className="p-1.5 hover:bg-slate-100 rounded-md text-indigo-500"><Icons.Edit /></button>
                        <button onClick={() => updateCurrentProject({ characters: currentProject.characters.filter(c => c.id !== char.id) })} className="p-1.5 hover:bg-slate-100 rounded-md text-rose-500"><Icons.Trash /></button>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 mb-3">{char.name}</h3>
                    <div className="space-y-3">
                      {currentProject.profileFields.slice(0, 5).map(f => (
                        <div key={f.id} className="text-sm flex flex-col border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{f.label}</span>
                          <span className="text-slate-600 font-medium break-words whitespace-pre-wrap leading-relaxed">{char.profileData[f.id] || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: RELATIONSHIPS */}
          {activeTab === 'relationships' && currentProject && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">인물 관계도</h2>
                  <p className="text-slate-500">인물들이 어떻게 연결되어 있는지 시각화하세요</p>
                </div>
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <RelationshipMap 
                    characters={currentProject.characters} 
                    relationships={currentProject.relationships} 
                  />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Icons.Plus /> 관계 추가
                  </h4>
                  <RelationshipForm 
                    characters={currentProject.characters} 
                    relationships={currentProject.relationships}
                    onAdd={(s, t) => updateCurrentProject({ 
                      relationships: [...currentProject.relationships, { id: Date.now().toString(), sourceId: s, targetId: t, description: '연결' }] 
                    })}
                    onDelete={(id) => updateCurrentProject({ 
                      relationships: currentProject.relationships.filter(r => r.id !== id) 
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE */}
          {activeTab === 'timeline' && currentProject && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">사건 연표</h2>
                  <p className="text-slate-500">주요 사건들을 시기별로 그룹화하여 관리하세요</p>
                </div>
                <button 
                  onClick={addTimelineEvent}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  <Icons.Plus /> 사건 추가
                </button>
              </header>
              
              <div className="relative pt-4">
                {/* 중앙 라인 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full hidden md:block" />
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 rounded-full md:hidden" />
                
                <div className="space-y-12">
                  {groupedTimeline.map((group, groupIdx) => {
                    const isEven = groupIdx % 2 === 0;
                    
                    return (
                      <div key={group.period} className={`relative flex flex-col md:flex-row items-start w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        {/* 시기 라벨 */}
                        <div className={`w-full md:w-1/2 px-14 mb-4 md:mb-0 sticky top-0 z-20 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="inline-block px-5 py-2 bg-white border border-indigo-100 rounded-full shadow-md">
                            <span className="text-sm font-black text-indigo-600 uppercase tracking-tighter">
                              {group.period}
                            </span>
                          </div>
                        </div>

                        {/* 중앙 노드 */}
                        <div className="absolute left-6 md:left-1/2 top-4 md:top-5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-md z-10 -translate-x-1/2" />

                        {/* 사건 그룹 카드들 */}
                        <div className="w-full md:w-1/2 px-14 space-y-4">
                          {group.events.map((event) => {
                            const isExpanded = expandedTimelineIds.includes(event.id);
                            return (
                              <div key={event.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                                    <input 
                                      type="text" 
                                      value={event.event} 
                                      onChange={(e) => updateCurrentProject({ timeline: currentProject.timeline.map(t => t.id === event.id ? { ...t, event: e.target.value } : t) })}
                                      className="font-bold text-lg text-slate-800 bg-transparent border-none focus:ring-0 flex-1 p-0 outline-none"
                                      placeholder="사건명"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => setExpandedTimelineIds(prev => prev.includes(event.id) ? prev.filter(x => x !== event.id) : [...prev, event.id])} 
                                      className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                                      title="상세 내용 보기"
                                    >
                                      {isExpanded ? <Icons.EyeOff /> : <Icons.Eye />}
                                    </button>
                                  </div>
                                </div>

                                {/* 상세 수정 필드들 (항상 보이진 않지만 시기 수정을 위해 필요) */}
                                <div className="mt-1 mb-2">
                                  <input 
                                    type="text"
                                    value={event.period}
                                    placeholder="시기 수정"
                                    onChange={(e) => updateCurrentProject({ timeline: currentProject.timeline.map(t => t.id === event.id ? { ...t, period: e.target.value } : t) })}
                                    className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-indigo-100"
                                  />
                                </div>

                                {isExpanded && (
                                  <textarea
                                    value={event.details}
                                    onChange={(e) => updateCurrentProject({ timeline: currentProject.timeline.map(t => t.id === event.id ? { ...t, details: e.target.value } : t) })}
                                    className="w-full mt-2 p-3 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:outline-none min-h-[100px] text-slate-600"
                                    placeholder="상세 내용을 입력하세요..."
                                  />
                                )}

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="color" 
                                      value={event.color} 
                                      onChange={(e) => updateCurrentProject({ timeline: currentProject.timeline.map(t => t.id === event.id ? { ...t, color: e.target.value } : t) })} 
                                      className="w-6 h-6 rounded-md cursor-pointer border-none p-0" 
                                    />
                                    <div className="flex items-center gap-1 border-l pl-3 border-slate-100">
                                      <button onClick={() => moveTimelineEvent(event.id, 'up')} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="순서 위로"><Icons.ChevronUp /></button>
                                      <button onClick={() => moveTimelineEvent(event.id, 'down')} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="순서 아래로"><Icons.ChevronDown /></button>
                                    </div>
                                  </div>
                                  <button onClick={() => updateCurrentProject({ timeline: currentProject.timeline.filter(t => t.id !== event.id) })} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Icons.Trash /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* OVERLAY: PROFILE CONFIG */}
      {showProfileConfig && currentProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">인물 프로필 항목 관리</h3>
              <button onClick={() => setShowProfileConfig(false)} className="text-slate-400 rotate-45"><Icons.Plus /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {currentProject.profileFields.map((field) => (
                <div key={field.id} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <input 
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium outline-none text-sm"
                    value={field.label}
                    onChange={(e) => updateCurrentProject({ 
                      profileFields: currentProject.profileFields.map(f => f.id === field.id ? { ...f, label: e.target.value } : f) 
                    })}
                  />
                  <button 
                    onClick={() => updateCurrentProject({ 
                      profileFields: currentProject.profileFields.filter(f => f.id !== field.id) 
                    })}
                    className="text-rose-400 hover:text-rose-600 p-1"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateCurrentProject({ 
                  profileFields: [...currentProject.profileFields, { id: Date.now().toString(), label: '새 항목', type: 'text' }] 
                })}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Icons.Plus /> 프로필 항목 추가
              </button>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowProfileConfig(false)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-semibold">완료</button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: CHARACTER EDIT */}
      {editingCharacter && currentProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800">인물 프로필 수정</h3>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">이름</label>
                <input 
                  type="text" 
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProject.profileFields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500">{field.label}</label>
                    {field.type === 'text' ? (
                      <textarea
                        value={editingCharacter.profileData[field.id] || ''}
                        onChange={(e) => setEditingCharacter({
                          ...editingCharacter,
                          profileData: { ...editingCharacter.profileData, [field.id]: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                      />
                    ) : (
                      <input 
                        type={field.type}
                        value={editingCharacter.profileData[field.id] || ''}
                        onChange={(e) => setEditingCharacter({
                          ...editingCharacter,
                          profileData: { ...editingCharacter.profileData, [field.id]: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setEditingCharacter(null)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-200">취소</button>
              <button 
                onClick={() => {
                  updateCurrentProject({ characters: currentProject.characters.map(c => c.id === editingCharacter.id ? editingCharacter : c) });
                  setEditingCharacter(null);
                }} 
                className="bg-indigo-600 text-white px-10 py-2.5 rounded-xl font-semibold"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const WorldSettingCard: React.FC<{
  item: WorldSetting, 
  onAddSub: () => void,
  onUpdate: (updates: Partial<WorldSetting>) => void,
  onDelete: () => void,
  updateGlobalById: (id: string, u: Partial<WorldSetting>) => void,
  removeGlobalById: (id: string) => void,
  addGlobalSubById: (id: string) => void,
  depth?: number
}> = ({ item, onAddSub, onUpdate, onDelete, updateGlobalById, removeGlobalById, addGlobalSubById, depth = 0 }) => {
  const [isChildrenCollapsed, setIsChildrenCollapsed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-8' : ''}`}>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm group">
        <div className="flex justify-between items-center gap-4 mb-2">
          <div className="flex items-center gap-2 flex-1">
            <button 
              onClick={() => setIsChildrenCollapsed(!isChildrenCollapsed)}
              className={`p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors ${item.children.length === 0 ? 'invisible' : ''}`}
              title="하위 항목 접기/펴기"
            >
              {isChildrenCollapsed ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
            </button>
            <input 
              type="text" 
              value={item.title} 
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={`flex-1 font-bold ${depth === 0 ? 'text-xl' : 'text-lg'} text-slate-800 bg-transparent border-none focus:ring-0 outline-none p-0`}
              placeholder="항목 제목"
            />
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg transition-colors ${showDetails ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
              title="자세한 설명 보기"
            >
              {showDetails ? <Icons.EyeOff /> : <Icons.Eye />}
            </button>
            <div className="h-4 w-px bg-slate-100 mx-1" />
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onAddSub} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg" title="하위 항목 추가"><Icons.Plus /></button>
              <button onClick={onDelete} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg" title="삭제"><Icons.Trash /></button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="md:col-span-3">
              <textarea 
                value={item.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="w-full min-h-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600 text-sm leading-relaxed"
                placeholder="상세 내용을 입력하세요..."
              />
            </div>
            <div className="space-y-2">
              <div className="aspect-square w-full max-w-[100px] mx-auto bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center text-slate-300">
                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Icons.Book />}
              </div>
              <input 
                type="text"
                placeholder="이미지 URL"
                value={item.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        )}
      </div>
      
      {!isChildrenCollapsed && item.children.length > 0 && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {item.children.map(child => (
            <WorldSettingCard 
              key={child.id} 
              item={child} 
              onAddSub={() => addGlobalSubById(child.id)}
              onUpdate={(u) => updateGlobalById(child.id, u)}
              onDelete={() => removeGlobalById(child.id)}
              updateGlobalById={updateGlobalById}
              removeGlobalById={removeGlobalById}
              addGlobalSubById={addGlobalSubById}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RelationshipForm: React.FC<{
  characters: Character[],
  relationships: Relationship[],
  onAdd: (s: string, t: string) => void,
  onDelete: (id: string) => void
}> = ({ characters, relationships, onAdd, onDelete }) => {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">인물 1 선택</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">인물 2 선택</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => { if (source && target) { onAdd(source, target); setSource(''); setTarget(''); }}} className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all">관계 추가</button>
      </div>
      <div className="pt-4 border-t border-slate-100 max-h-[300px] overflow-y-auto scrollbar-hide space-y-2">
        {relationships.map(r => {
          const sChar = characters.find(c => c.id === r.sourceId);
          const tChar = characters.find(c => c.id === r.targetId);
          return (
            <div key={r.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl group border border-slate-100">
              <span className="text-sm font-medium text-slate-700">{sChar?.name} ↔ {tChar?.name}</span>
              <button onClick={() => onDelete(r.id)} className="text-rose-400 group-hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"><Icons.Trash /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
