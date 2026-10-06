import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { tasks as allTasks } from '@/data/mockData';
import { taskStatusConfig, cn } from '@/lib/utils';
import type { TaskStatus } from '@/types';
import { ListTodo, Search } from 'lucide-react';

const filterTabs: { id: TaskStatus | 'all'; label: string; count?: number }[] = [
  { id: 'all', label: 'All' },
  { id: 'running', label: 'Running' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' },
  { id: 'waiting_approval', label: 'Waiting for Approval' },
];

export function TasksPage() {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = allTasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: allTasks.length,
    running: allTasks.filter((t) => t.status === 'running').length,
    completed: allTasks.filter((t) => t.status === 'completed').length,
    failed: allTasks.filter((t) => t.status === 'failed').length,
    waiting_approval: allTasks.filter((t) => t.status === 'waiting_approval').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Monitor all tasks across your AI workforce." />

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs
          tabs={filterTabs.map((t) => ({ id: t.id, label: t.label, count: counts[t.id as keyof typeof counts] }))}
          active={filter}
          onChange={(v) => setFilter(v as TaskStatus | 'all')}
        />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {/* Table header - desktop */}
            <div className="hidden md:flex items-center px-4 py-2.5 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <div className="flex-1">Task</div>
              <div className="w-32">Employee</div>
              <div className="w-24">Started</div>
              <div className="w-20">Duration</div>
              <div className="w-32">Status</div>
            </div>
            {filtered.map((task) => {
              const tStatus = taskStatusConfig[task.status];
              return (
                <div key={task.id} className="flex flex-col md:flex-row md:items-center px-4 py-3.5 hover:bg-slate-50 transition-colors gap-2 md:gap-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{task.description}</p>
                    {task.status === 'running' && (
                      <div className="mt-2 w-full max-w-xs">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-600 rounded-full animate-pulse" style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 md:w-32">
                    <div className={cn('w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold', `bg-${task.employeeColor}-100 text-${task.employeeColor}-700`)}>
                      {task.employeeName.split(' ')[0].slice(0, 2)}
                    </div>
                    <span className="text-xs text-slate-600 truncate">{task.employeeName.split(' — ')[0]}</span>
                  </div>
                  <div className="text-xs text-slate-400 md:w-24">{task.started}</div>
                  <div className="text-xs text-slate-400 md:w-20">{task.duration}</div>
                  <div className="md:w-32">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md', tStatus.bg, tStatus.text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', tStatus.dot)} />
                      {tStatus.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<ListTodo className="w-7 h-7" />}
            title="No tasks found"
            description="Tasks will appear here when your AI employees start working."
          />
        )}
      </Card>
    </div>
  );
}
