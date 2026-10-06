import { useNav } from '@/context/NavContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { showToast } from '@/components/ui/Toast';
import { employees } from '@/data/mockData';
import { statusConfig, cn } from '@/lib/utils';
import {
  Plus, Pause, Play, Settings as SettingsIcon, ChevronRight,
  CheckCircle2, Target, Clock, Zap, Wrench,
} from 'lucide-react';

export function EmployeesPage() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Employees"
        subtitle="Build and manage your digital workforce."
        action={{ label: '+ Hire AI Employee', onClick: () => navigate('hire'), icon: <Plus className="w-4 h-4" /> }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map((emp) => {
          const status = statusConfig[emp.status];
          return (
            <Card key={emp.id} className="p-5 hover:shadow-card-hover transition-all duration-200">
              {/* Header */}
              <div className="flex items-start gap-3">
                <Avatar name={emp.name} color={emp.avatarColor} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{emp.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={cn('w-1.5 h-1.5 rounded-full', status.dot, emp.status === 'working' && 'animate-pulse-ring')} />
                    <span className={cn('text-xs font-medium', status.text)}>{status.label}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-3">{emp.description}</p>

              {/* Current task */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Current task</p>
                <p className="text-sm text-slate-700 mt-1 flex items-center gap-2">
                  {emp.status === 'working' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />}
                  {emp.currentTask}
                </p>
                {(emp.status === 'working' || emp.status === 'needs_approval') && emp.taskProgress > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', emp.status === 'needs_approval' ? 'bg-amber-500' : 'bg-brand-600')} style={{ width: `${emp.taskProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Performance */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-slate-400 mb-1"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">{emp.tasksCompleted}</p>
                  <p className="text-[10px] text-slate-400">Tasks</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-slate-400 mb-1"><Target className="w-3.5 h-3.5" /></div>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">{emp.successRate}%</p>
                  <p className="text-[10px] text-slate-400">Success</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-slate-400 mb-1"><Clock className="w-3.5 h-3.5" /></div>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">{emp.timeSavedHours}h</p>
                  <p className="text-[10px] text-slate-400">Saved</p>
                </div>
              </div>

              {/* Tools */}
              <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                {emp.tools.slice(0, 4).map((tool) => (
                  <span key={tool.id} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{tool.name}</span>
                ))}
              </div>

              {/* Last active */}
              <p className="text-xs text-slate-400 mt-3">Last active: {emp.lastActive}</p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button size="sm" variant="primary" className="flex-1" onClick={() => navigate('employee-detail', { id: emp.id })}>
                  Open <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                {emp.status === 'paused' ? (
                  <Button size="sm" variant="secondary" icon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => showToast('success', `${emp.name.split(' — ')[0]} resumed`)}
                  />
                ) : (
                  <Button size="sm" variant="secondary" icon={<Pause className="w-3.5 h-3.5" />}
                    onClick={() => showToast('info', `${emp.name.split(' — ')[0]} paused`)}
                  />
                )}
                <Button size="sm" variant="ghost" icon={<SettingsIcon className="w-3.5 h-3.5" />}
                  onClick={() => navigate('employee-detail', { id: emp.id })}
                />
              </div>
            </Card>
          );
        })}

        {/* Hire card */}
        <button
          onClick={() => navigate('hire')}
          className="border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">Hire AI Employee</p>
          <p className="text-xs mt-1">Add a new role to your workforce</p>
        </button>
      </div>
    </div>
  );
}
