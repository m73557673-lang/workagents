import { useNav } from '@/context/NavContext';
import type { PageId } from '@/context/NavContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, ListTodo, CheckSquare, Workflow,
  BookOpen, Plug, Activity, BarChart3, HelpCircle, Settings,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft,
  LifeBuoy, Sparkles,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const mainNav: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'employees', label: 'AI Employees', icon: Users },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomNav: NavItem[] = [
  { id: 'help', label: 'Help & Support', icon: LifeBuoy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { page, navigate, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useNav();
  const collapsed = sidebarCollapsed;

  const handleNav = (id: PageId) => {
    if (id === 'employees') navigate('employees');
    else if (id === 'overview') navigate('overview');
    else navigate(id);
  };

  const isActive = (id: PageId) => {
    if (id === 'employees' && page === 'employee-detail') return true;
    return page === id;
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 px-4 h-16 border-b border-slate-100 flex-shrink-0', collapsed && 'justify-center px-0')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 leading-none">AI Workforce</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Working 24/7</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group',
                    collapsed && 'justify-center',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-600 rounded-r-full" />}
                  <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-brand-600' : 'text-slate-400')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.id === 'approvals' && (
                    <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">4</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-0.5">
            {bottomNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    collapsed && 'justify-center',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-brand-600' : 'text-slate-400')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User profile */}
        <div className={cn('border-t border-slate-100 p-2', collapsed && 'px-1')}>
          <button
            onClick={() => navigate('settings')}
            className={cn(
              'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              AM
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden flex-1">
                <p className="text-sm font-medium text-slate-900 truncate leading-none">Alex Morgan</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate leading-none">alex@acmedigital.com</p>
              </div>
            )}
          </button>
        </div>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
}
