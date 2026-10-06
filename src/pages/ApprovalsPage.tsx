import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { showToast } from '@/components/ui/Toast';
import { approvals as initialApprovals } from '@/data/mockData';
import { riskConfig, approvalStatusConfig, cn } from '@/lib/utils';
import type { ApprovalStatus } from '@/types';
import {
  Check, X, FileText, Clock, Shield, AlertTriangle,
  CheckSquare,
} from 'lucide-react';

const tabs: { id: ApprovalStatus; label: string; count: number }[] = [
  { id: 'pending', label: 'Pending', count: 4 },
  { id: 'approved', label: 'Approved', count: 1 },
  { id: 'rejected', label: 'Rejected', count: 1 },
  { id: 'expired', label: 'Expired', count: 1 },
];

export function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus>('pending');
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = approvals.filter((a) => a.status === activeTab);

  const updateStatus = (id: string, status: ApprovalStatus) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === 'approved') showToast('success', 'Approval granted', 'The AI employee will proceed.');
    else if (status === 'rejected') showToast('info', 'Action rejected', 'The AI employee has been notified.');
  };

  const bulkApprove = () => {
    selected.forEach((id) => updateStatus(id, 'approved'));
    setSelected([]);
    showToast('success', `${selected.length} approvals granted`);
  };

  const toggleSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Approval Center" subtitle="Stay in control of your AI workforce." />

      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={(v) => { setActiveTab(v as ApprovalStatus); setSelected([]); }}
      />

      {/* Bulk actions */}
      {activeTab === 'pending' && selected.length > 0 && (
        <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-lg px-4 py-2.5 animate-fade-in">
          <span className="text-sm text-brand-700 font-medium">{selected.length} selected</span>
          <Button size="sm" variant="primary" icon={<Check className="w-3.5 h-3.5" />} onClick={bulkApprove}>
            Approve All
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((apr) => {
            const risk = riskConfig[apr.risk];
            const statusCfg = approvalStatusConfig[apr.status];
            const isSelected = selected.includes(apr.id);
            return (
              <Card key={apr.id} className={cn('p-5', isSelected && 'ring-2 ring-brand-300')}>
                <div className="flex items-start gap-4">
                  {/* Checkbox for pending */}
                  {activeTab === 'pending' && (
                    <button
                      onClick={() => toggleSelect(apr.id)}
                      className={cn(
                        'mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected ? 'bg-brand-600 border-brand-600' : 'border-slate-300 hover:border-brand-400'
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </button>
                  )}

                  <Avatar name={apr.employeeName} color="blue" size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {apr.employeeName.split(' — ')[0]} wants to {apr.action}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{apr.reason}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border', risk.bg, risk.text, risk.border)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', risk.dot)} />
                          {risk.label} Risk
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Impact</p>
                          <p className="text-xs text-slate-600 mt-0.5">{apr.impact}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Requested</p>
                          <p className="text-xs text-slate-600 mt-0.5">{apr.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</p>
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mt-0.5', statusCfg.bg, statusCfg.text)}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {activeTab === 'pending' && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                        <Button size="sm" variant="primary" icon={<Check className="w-3.5 h-3.5" />} onClick={() => updateStatus(apr.id, 'approved')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="secondary" icon={<X className="w-3.5 h-3.5" />} onClick={() => updateStatus(apr.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button size="sm" variant="ghost" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => showToast('info', 'Details dialog would open here')}>
                          Edit & Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card>
            <EmptyState
              icon={<CheckSquare className="w-7 h-7" />}
              title={`No ${activeTab} approvals`}
              description={activeTab === 'pending' ? "You're all caught up! No approvals waiting." : `No ${activeTab} approvals to show.`}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
