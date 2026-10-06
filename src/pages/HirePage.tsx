import { useState } from 'react';
import { useNav } from '@/context/NavContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { showToast } from '@/components/ui/Toast';
import { roleTemplates, integrations } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Headphones, Megaphone, DollarSign, Settings,
  ArrowLeft, ArrowRight, Check, Sparkles, Lock, Plug,
  Shield, CheckCircle2, Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  TrendingUp, Headphones, Megaphone, DollarSign, Settings,
};

const steps = ['Choose Role', 'Configure', 'Permissions', 'Connect Tools', 'Review'];

const permissionGroups = [
  {
    title: 'Read',
    items: [
      { id: 'read-crm', label: 'View CRM', risk: 'low' },
      { id: 'read-customers', label: 'Read customer information', risk: 'low' },
      { id: 'read-knowledge', label: 'Read company knowledge', risk: 'low' },
      { id: 'read-analytics', label: 'View analytics', risk: 'low' },
    ],
  },
  {
    title: 'Create',
    items: [
      { id: 'create-leads', label: 'Create leads', risk: 'low' },
      { id: 'create-tasks', label: 'Create tasks', risk: 'low' },
      { id: 'create-drafts', label: 'Create drafts', risk: 'low' },
    ],
  },
  {
    title: 'Execute',
    items: [
      { id: 'send-emails', label: 'Send emails', risk: 'medium' },
      { id: 'modify-crm', label: 'Modify CRM records', risk: 'medium' },
      { id: 'schedule-meetings', label: 'Schedule meetings', risk: 'medium' },
    ],
  },
  {
    title: 'Restricted',
    items: [
      { id: 'delete-data', label: 'Delete customer data', risk: 'high', locked: true },
      { id: 'issue-refunds', label: 'Issue refunds', risk: 'high', locked: true },
      { id: 'transfer-money', label: 'Transfer money', risk: 'high', locked: true },
    ],
  },
];

const riskColors: Record<string, { dot: string; text: string }> = {
  low: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  medium: { dot: 'bg-amber-500', text: 'text-amber-600' },
  high: { dot: 'bg-red-500', text: 'text-red-600' },
};

export function HirePage() {
  const { navigate } = useNav();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [config, setConfig] = useState({ name: '', goal: '', instructions: '', timezone: 'America/New_York', style: 'professional' });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    'read-crm': true, 'read-customers': true, 'read-knowledge': true, 'read-analytics': true,
    'create-leads': true, 'create-tasks': true, 'create-drafts': true,
    'send-emails': false, 'modify-crm': false, 'schedule-meetings': false,
  });
  const [connectedTools, setConnectedTools] = useState<Record<string, boolean>>({});

  const canProceed = () => {
    if (step === 0) return selectedRole !== null;
    if (step === 1) return config.name.trim() !== '' && config.goal.trim() !== '';
    return true;
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      showToast('success', 'AI Employee hired!', `${config.name} is now part of your workforce.`);
      navigate('employees');
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
    else navigate('employees');
  };

  const selectedRoleTemplate = roleTemplates.find((r) => r.id === selectedRole);
  const connectedList = integrations.filter((i) => connectedTools[i.id]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button onClick={prev} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-slate-900">Hire an AI Employee</h1>
        <p className="text-sm text-slate-500 mt-1">Choose a role and configure what your employee can do.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8 overflow-x-auto scrollbar-thin pb-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                i < step ? 'bg-brand-600 text-white' :
                i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                'bg-slate-100 text-slate-400'
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn('text-sm font-medium whitespace-nowrap', i <= step ? 'text-slate-900' : 'text-slate-400')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={cn('w-8 h-px mx-3', i < step ? 'bg-brand-600' : 'bg-slate-200')} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 1: Choose Role */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-semibold text-slate-900">Choose a role</h2>
            <p className="text-sm text-slate-500">Select the type of work your AI employee will handle.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleTemplates.map((role) => {
                const Icon = iconMap[role.icon] || Settings;
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3',
                      active ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                    </div>
                    {active && <Check className="w-5 h-5 text-brand-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedRole('custom')}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 border-dashed transition-all flex items-center gap-3',
                selectedRole === 'custom' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', selectedRole === 'custom' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500')}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Create Custom Employee</p>
                <p className="text-xs text-slate-500 mt-0.5">Define a custom role from scratch</p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in max-w-2xl">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Configure your employee</h2>
              <p className="text-sm text-slate-500 mt-1">Define what your AI employee will do and how it should behave.</p>
            </div>
            <Input
              label="Employee name"
              placeholder="Alex — Sales Assistant"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              hint="Give your employee a name you'll recognize."
            />
            <Input
              label="Primary goal"
              placeholder="Generate qualified sales meetings"
              value={config.goal}
              onChange={(e) => setConfig({ ...config, goal: e.target.value })}
              hint="What is the main objective of this employee?"
            />
            <Textarea
              label="Instructions"
              placeholder="Your job is to research prospects, qualify leads, prepare personalized outreach..."
              rows={5}
              value={config.instructions}
              onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
              hint="Tell your employee how to approach its work."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Working hours"
                options={[
                  { value: '24/7', label: '24/7 — Always on' },
                  { value: 'business', label: 'Business hours (9–5)' },
                  { value: 'custom', label: 'Custom schedule' },
                ]}
              />
              <Select
                label="Timezone"
                options={[
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
                  { value: 'Europe/London', label: 'Europe/London (GMT)' },
                  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
                ]}
                value={config.timezone}
                onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
              />
            </div>
            <Select
              label="Communication style"
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'friendly', label: 'Friendly' },
                { value: 'concise', label: 'Concise' },
                { value: 'formal', label: 'Formal' },
              ]}
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
            />
          </div>
        )}

        {/* Step 3: Permissions */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-900">What can this employee do?</h2>
              <p className="text-sm text-slate-500 mt-1">You stay in control. Sensitive actions can require approval.</p>
            </div>
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <p className="text-sm text-brand-700">You stay in control. Sensitive actions can require approval.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionGroups.map((group) => (
                <div key={group.title} className="border border-slate-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">{group.title}</h3>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <Checkbox
                          checked={permissions[item.id] || false}
                          onChange={(checked) => setPermissions({ ...permissions, [item.id]: checked })}
                          locked={(item as any).locked}
                          label={item.label}
                        />
                        <span className={cn('inline-flex items-center gap-1 text-xs font-medium', riskColors[item.risk].text)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', riskColors[item.risk].dot)} />
                          {item.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Connect Tools */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Connect tools</h2>
              <p className="text-sm text-slate-500 mt-1">Connect the services your AI employee will use to do its work.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {integrations.slice(0, 12).map((tool) => {
                const connected = connectedTools[tool.id] || tool.connected;
                return (
                  <div key={tool.id} className={cn(
                    'border rounded-xl p-4 transition-all',
                    connected ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold', `bg-${tool.iconColor}-100 text-${tool.iconColor}-700`)}>
                        {tool.initials}
                      </div>
                      {connected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tool.description}</p>
                    <Button
                      size="sm"
                      variant={connected ? 'secondary' : 'primary'}
                      className="w-full mt-3"
                      disabled={connected}
                      onClick={() => {
                        setConnectedTools({ ...connectedTools, [tool.id]: true });
                        showToast('success', `${tool.name} connected`);
                      }}
                    >
                      {connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in max-w-2xl">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Review and hire</h2>
              <p className="text-sm text-slate-500 mt-1">Confirm your AI employee configuration before hiring.</p>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-slate-50 rounded-xl p-5 border border-brand-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{config.name || 'New AI Employee'}</p>
                  <p className="text-sm text-slate-500">{selectedRoleTemplate?.name || 'Custom Role'}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Goal</p>
                  <p className="text-slate-700 mt-0.5">{config.goal || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tools</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {connectedList.length > 0 ? connectedList.map((t) => (
                      <Badge key={t.id} variant="info">{t.name}</Badge>
                    )) : <span className="text-slate-400">No tools connected</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Permissions</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Object.entries(permissions).filter(([, v]) => v).map(([k]) => {
                      const allItems = permissionGroups.flatMap((g) => g.items);
                      const item = allItems.find((i) => i.id === k);
                      return item ? <Badge key={k} variant="neutral">{item.label}</Badge> : null;
                    })}
                  </div>
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Send emails → Approval required
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
          <Button variant="ghost" onClick={prev} icon={<ArrowLeft className="w-4 h-4" />}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={next} disabled={!canProceed()} icon={step < 4 ? <ArrowRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}>
            {step < 4 ? 'Continue' : 'Hire AI Employee'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
