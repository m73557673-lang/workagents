import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type PageId =
  | 'overview' | 'employees' | 'hire' | 'employee-detail'
  | 'tasks' | 'approvals' | 'automations' | 'knowledge'
  | 'integrations' | 'activity' | 'analytics'
  | 'settings' | 'help';

interface NavContextType {
  page: PageId;
  params: Record<string, string>;
  navigate: (page: PageId, params?: Record<string, string>) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('overview');
  const [params, setParams] = useState<Record<string, string>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navigate = useCallback((newPage: PageId, newParams?: Record<string, string>) => {
    setPage(newPage);
    setParams(newParams || {});
    setMobileSidebarOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

  return (
    <NavContext.Provider value={{
      page, params, navigate,
      sidebarCollapsed, toggleSidebar,
      mobileSidebarOpen, setMobileSidebarOpen,
      chatOpen, setChatOpen,
    }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
