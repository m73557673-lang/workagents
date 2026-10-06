import { useState } from 'react';
import { useNav } from '@/context/NavContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { showToast } from '@/components/ui/Toast';
import { employees, approvals, activityLog, dashboardStats } from '@/data/mockData';
import { statusConfig, riskConfig, cn } from '@/lib/utils';
import type { ActivityEntry } from '@/types';
import {
  Users, CheckCircle2, Target, Clock, Plus, ArrowRight,
  Check, X, ChevronRight, Activity as ActivityIcon,
} from 'lucide-react';

const activityFilters = ['All', 'Employees', 'Tasks', 'Approvals', 'Automations'] as const;

export function OverviewPage() {
  const { navigate } = useNav();
  const [filter, setFilter] = useState<typeof activityFilters[number]>('All');
  const [approvalState, setApprovalState] = useState<Record<string, 'approved' | 'rejected' | null>>({});

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const activeEmployees = employees.filter((e) => e.status === 'working' || e.status === 'needs_approval');

  const filteredActivity = activityLog.filter((entry) => {
    if (filter === 'All') return true;
    return entry.category === filter.toLowerCase().replace(/s$/, '');
  });

  const handleApprove = (id: string) => {
    setApprovalState({ ...approvalState, [id]: 'approved' });
    showToast('success', 'Approval granted', 'The AI employee will proceed with the action.');
  };

  const handleReject = (id: string) => {
    setApprovalState({ ...approvalState, [id]: 'rejected' });
    showToast('info', 'Action rejected', 'The AI employee has been notified.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Alex"
        subtitle="Here's what your AI workforce has been doing today."
        action={{ label: '+ Hire AI Employee', onClick: () => navigate('hire'), icon: <Plus className="w-4 h-4" /> }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Employees"
          value={dashboardStats.activeEmployees}
          icon={Users}
          iconColor="text-brand-600 bg-brand-50"
          trend={0}
          trendLabel="Same as yesterday"
        />
        <StatCard
          label="Tasks Completed"
          value={dashboardStats.tasksCompleted}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
          trend={12}
          trendLabel="vs. last week"
        />
        <StatCard
          label="Success Rate"
          value={`${dashboardStats.successRate}%`}
          icon={Target}
          iconColor="text-violet-600 bg-violet-50"
          trend={2.1}
          trendLabel="vs. last week"
        />
        <StatCard
          label="Time Saved"
          value={`${dashboardStats.timeSavedHours} hrs`}
          icon={Clock}
          iconColor="text-amber-600 bg-amber-50"
          trend={8.3}
          trendLabel="vs. last week"
        />
      </div>

      {/* AI Workforce + Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Employees */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Your AI Employees</h2>
            <button
              onClick={() => navigate('employees')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employees.slice(0, 4).map((emp) => {
              const status = statusConfig[emp.status];
              return (
                <Card key={emp.id} hover onClick={() => navigate('employee-detail', { id: emp.id })} className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={emp.name} color={emp.avatarColor} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{emp.name.split(' — ')[0]}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot, emp.status === 'working' && 'animate-pulse-ring')} />
                        <span className={cn('text-xs font-medium', status.text)}>{status.label}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">{emp.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span><span className="font-semibold text-slate-700">{emp.tasksCompleted}</span> tasks</span>
                    {emp.metrics[0] && <span><span className="font-semibold text-slate-700">{emp.metrics[0].value}</span> {emp.metrics[0].label.toLowerCase()}</span>}
                    {emp.metrics[1] && <span><span className="font-semibold text-slate-700">{emp.metrics[1].value}</span> {emp.metrics[1].label.toLowerCase()}</span>}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {emp.status === 'needs_approval' ? (
                      <Button size="sm" variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); navigate('approvals'); }}>
                        Review <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" className="w-full" onClick={(e) => { e.stopPropagation(); navigate('employee-detail', { id: emp.id }); }}>
                        View Employee <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          <button
            onClick={() => navigate('hire')}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Hire another employee
          </button>
        </div>

        {/* Approval Center Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Needs Your Approval</h2>
            <button
              onClick={() => navigate('approvals')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingApprovals.slice(0, 3).map((apr) => {
              const risk = riskConfig[apr.risk];
              const state = approvalState[apr.id];
              return (
                <Card key={apr.id} className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Avatar name={apr.employeeName} color="blue" size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{apr.employeeName.split(' — ')[0]} wants to {apr.action}</p>
                      <p className="text-xs text-slate-500 mt-1">{apr.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md', risk.bg, risk.text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', risk.dot)} />
                      {risk.label} Risk
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">{apr.timestamp}</span>
                  </div>
                  {state ? (
                    <div className={cn('mt-3 py-2 text-center text-xs font-medium rounded-lg', state === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                      {state === 'approved' ? '✓ Approved' : '✕ Rejected'}
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="primary" className="flex-1" onClick={() => handleApprove(apr.id)}>
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleReject(apr.id)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
          <button
            onClick={() => navigate('activity')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto scrollbar-thin">
            {activityFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                  filter === f ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="divide-y divide-slate-50">
            {filteredActivity.slice(0, 8).map((entry: ActivityEntry) => (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="text-xs text-slate-400 font-mono w-16 flex-shrink-0">{entry.time}</div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ActivityIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{entry.employeeName}</span>
                    <span className="text-slate-500"> {entry.action.toLowerCase()} </span>
                    <span className="font-medium text-slate-700">{entry.target}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {entry.result === 'success' && <Badge variant="success" dot dotColor="bg-emerald-500">Success</Badge>}
                  {entry.result === 'warning' && <Badge variant="warning" dot dotColor="bg-amber-500">Review</Badge>}
                  {entry.result === 'error' && <Badge variant="error" dot dotColor="bg-red-500">Failed</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
