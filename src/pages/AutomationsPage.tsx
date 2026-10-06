import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import { automations as initialAutomations } from '@/data/mockData';
import { automationStatusConfig, cn } from '@/lib/utils';
import type { AutomationStep } from '@/types';
import {
  Plus, Play, Pause, Zap, ArrowDown, Circle,
  Settings as SettingsIcon, MoreHorizontal, Workflow,
} from 'lucide-react';

const stepTypeConfig: Record<AutomationStep['type'], { color: string; bg: string; border: string; label: string; icon: typeof Zap }> = {
  trigger: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Trigger', icon: Zap },
  action: { color: 'text-slate-700', bg: 'bg-white', border: 'border-slate-200', label: 'Action', icon: Circle },
  approval: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Approval', icon: Circle },
  output: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Output', icon: Circle },
};

export function AutomationsPage() {
  const [automations, setAutomations] = useState(initialAutomations);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map((a) =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
    const aut = automations.find((a) => a.id === id);
    showToast(aut?.status === 'active' ? 'info' : 'success', `${aut?.name} ${aut?.status === 'active' ? 'paused' : 'resumed'}`);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    showToast('success', 'Automation created', `"${newName}" has been created as a draft.`);
    setCreateOpen(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        subtitle="Create workflows that connect your AI employees to your business tools."
        action={{ label: '+ Create Automation', onClick: () => setCreateOpen(true), icon: <Plus className="w-4 h-4" /> }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {automations.map((aut) => {
          const status = automationStatusConfig[aut.status];
          return (
            <Card key={aut.id} className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', status.bg)}>
                      <Workflow className={cn('w-4 h-4', status.text)} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{aut.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{aut.description}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0', status.bg, status.text)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                  {status.label}
                </span>
              </div>

              {/* Workflow visualization */}
              <div className="bg-slate-50 rounded-lg p-4 my-3">
                <div className="space-y-0">
                  {aut.steps.map((step, i) => {
                    const cfg = stepTypeConfig[step.type];
                    const Icon = cfg.icon;
                    return (
                      <div key={step.id}>
                        <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm', cfg.bg, cfg.border)}>
                          <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', cfg.color)} />
                          <span className={cn('text-xs font-medium', cfg.color)}>{cfg.label}:</span>
                          <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">{step.label}</span>
                        </div>
                        {i < aut.steps.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span><span className="font-semibold text-slate-700">{aut.runsThisWeek}</span> runs this week</span>
                  <span>·</span>
                  <span>Last: {aut.lastRun}</span>
                </div>
                <div className="flex items-center gap-1">
                  {aut.status === 'active' ? (
                    <Button size="sm" variant="ghost" icon={<Pause className="w-3.5 h-3.5" />} onClick={() => toggleAutomation(aut.id)} />
                  ) : (
                    <Button size="sm" variant="ghost" icon={<Play className="w-3.5 h-3.5" />} onClick={() => toggleAutomation(aut.id)} />
                  )}
                  <Button size="sm" variant="ghost" icon={<SettingsIcon className="w-3.5 h-3.5" />} onClick={() => showToast('info', 'Automation settings would open here')} />
                </div>
              </div>
            </Card>
          );
        })}

        {/* Create card */}
        <button
          onClick={() => setCreateOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">Create Automation</p>
          <p className="text-xs mt-1">Build a new workflow</p>
        </button>
      </div>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Automation"
        subtitle="Define a trigger and actions for your AI workforce to execute."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create as Draft</Button>
          </>
        }
      >
        <div className="p-6 space-y-4">
          <Input
            label="Automation name"
            placeholder="New Lead Follow-up"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Describe what this automation does..."
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Trigger</label>
            <div className="space-y-2">
              {['New lead added to CRM', 'New support ticket created', 'Daily scheduled check', 'Inventory below threshold'].map((t) => (
                <button key={t} className="w-full text-left px-3 py-2.5 text-sm border border-slate-200 rounded-lg hover:border-brand-300 hover:bg-brand-50/30 transition-all flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
