import { useState, useRef, useEffect } from 'react';
import { useNav } from '@/context/NavContext';
import { cn } from '@/lib/utils';
import { notifications as initialNotifications } from '@/data/mockData';
import { showToast } from '@/components/ui/Toast';
import {
  Search, Bell, HelpCircle, ChevronDown, Menu,
  CheckCircle2, AlertCircle, XCircle, Info, X,
} from 'lucide-react';

export function Topbar() {
  const { setMobileSidebarOpen, navigate } = useNav();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const [searchValue, setSearchValue] = useState('');
  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) setWorkspaceOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
    showToast('success', 'Notifications marked as read');
  };

  const notifIcons = {
    approval: <AlertCircle className="w-4 h-4 text-amber-600" />,
    error: <XCircle className="w-4 h-4 text-red-600" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600" />,
    info: <Info className="w-4 h-4 text-blue-600" />,
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 gap-3">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 -ml-1"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Workspace selector */}
      <div ref={workspaceRef} className="relative">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Acme Digital</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Pro Plan</p>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', workspaceOpen && 'rotate-180')} />
        </button>

        {workspaceOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-elevated border border-slate-200 py-2 animate-fade-in z-50">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Workspaces</p>
            {[
              { name: 'Acme Digital', plan: 'Pro Plan', active: true },
              { name: 'Stellar Ventures', plan: 'Team Plan', active: false },
              { name: 'Personal', plan: 'Free Plan', active: false },
            ].map((ws) => (
              <button
                key={ws.name}
                onClick={() => { setWorkspaceOpen(false); showToast('info', `Switched to ${ws.name}`); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left',
                  ws.active && 'bg-brand-50'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold',
                  ws.active ? 'bg-gradient-to-br from-brand-500 to-brand-700' : 'bg-slate-400'
                )}>
                  {ws.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{ws.name}</p>
                  <p className="text-xs text-slate-400">{ws.plan}</p>
                </div>
                {ws.active && <div className="w-2 h-2 rounded-full bg-brand-600" />}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 px-3">
              <button
                onClick={() => { setWorkspaceOpen(false); showToast('info', 'Create workspace dialog would open here'); }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Create Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search employees, tasks, approvals..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-200 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchValue) {
              showToast('info', `Searching for "${searchValue}"...`);
              setSearchValue('');
            }
          }}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">⌘K</kbd>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Help */}
        <button
          onClick={() => navigate('help')}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-xl shadow-elevated border border-slate-200 animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                <button onClick={markAllRead} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  Mark all read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer',
                      !n.read && 'bg-brand-50/30'
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">{notifIcons[n.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5 truncate">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.timestamp}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setNotifOpen(false); navigate('activity'); }}
                className="w-full text-center py-2.5 text-sm text-brand-600 hover:text-brand-700 font-medium border-t border-slate-100"
              >
                View all activity
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('settings')}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-xs font-semibold ml-1 hover:ring-2 hover:ring-brand-200 transition-all"
        >
          AM
        </button>
      </div>
    </header>
  );
}
