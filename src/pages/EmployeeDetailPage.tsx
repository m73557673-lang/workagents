import { useState } from 'react';
import { useNav } from '@/context/NavContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { showToast } from '@/components/ui/Toast';
import { employees, tasks, activityLog } from '@/data/mockData';
import { statusConfig, taskStatusConfig, cn } from '@/lib/utils';
import {
  ArrowLeft, Pause, Play, Settings as SettingsIcon,
  CheckCircle2, Target, Clock, Zap, ListTodo, Activity,
  BookOpen, Plug, Shield, Wrench, Cpu, Circle, Check, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const tabConfig: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: Cpu },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'tools', label: 'Tools', icon: Plug },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function EmployeeDetailPage() {
  const { params, navigate } = useNav();
  const [activeTab, setActiveTab] = useState('overview');
  const employee = employees.find((e) => e.id === params.id) || employees[0];
  const status = statusConfig[employee.status];

  const empTasks = tasks.filter((t) => t.employeeId === employee.id);
  const empActivity = activityLog.filter((a) => a.employeeId === employee.id);

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('employees')} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </button>

      {/* Header */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <Avatar name={employee.name} color={employee.avatarColor} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900">{employee.name}</h1>
              <div className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium', status.bg, status.text)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', status.dot, employee.status === 'working' && 'animate-pulse-ring')} />
                {status.label}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">{employee.role}</p>
            <p className="text-sm text-slate-600 mt-2">{employee.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Last active: {employee.lastActive}</span>
              <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5" /> {employee.tools.length} tools</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {employee.status === 'paused' ? (
              <Button variant="primary" size="md" icon={<Play className="w-4 h-4" />} onClick={() => showToast('success', 'Employee resumed')}>Resume</Button>
            ) : (
              <Button variant="secondary" size="md" icon={<Pause className="w-4 h-4" />} onClick={() => showToast('info', 'Employee paused')}>Pause</Button>
            )}
            <Button variant="ghost" size="md" icon={<SettingsIcon className="w-4 h-4" />} onClick={() => setActiveTab('settings')}>Configure</Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabConfig.map(t => ({ id: t.id, label: t.label, icon: <t.icon className="w-4 h-4" /> }))} active={activeTab} onChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Current work */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-slate-900">Current Work</h3>
                <span className="text-xs text-slate-400 ml-auto">Task #1042</span>
              </div>
            </div>
            <CardBody>
              <p className="text-sm text-slate-600 mb-1">Research prospect:</p>
              <p className="text-base font-semibold text-slate-900 mb-4">{employee.currentTask}</p>
              <Progress value={employee.taskProgress} color="bg-brand-600" showLabel />
              <div className="mt-5 space-y-1">
                {employee.taskSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs',
                      step.status === 'done' ? 'bg-emerald-100 text-emerald-600' :
                      step.status === 'current' ? 'bg-brand-100 text-brand-600 ring-2 ring-brand-200' :
                      'bg-slate-100 text-slate-400'
                    )}>
                      {step.status === 'done' ? <Check className="w-3 h-3" strokeWidth={3} /> :
                       step.status === 'current' ? <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" /> :
                       <Circle className="w-2.5 h-2.5" />}
                    </div>
                    <span className={cn(
                      'text-sm',
                      step.status === 'done' ? 'text-slate-400 line-through' :
                      step.status === 'current' ? 'text-slate-900 font-medium' :
                      'text-slate-400'
                    )}>
                      {step.label}
                    </span>
                    {step.status === 'current' && <span className="ml-auto text-xs text-brand-600 font-medium animate-pulse">Running...</span>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Performance */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Performance</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><CheckCircle2 className="w-4 h-4" /><span className="text-xs">Tasks completed</span></div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{employee.tasksCompleted}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Target className="w-4 h-4" /><span className="text-xs">Success rate</span></div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{employee.successRate}%</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Clock className="w-4 h-4" /><span className="text-xs">Time saved</span></div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{employee.timeSavedHours}h</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2"><Zap className="w-4 h-4" /><span className="text-xs">Actions performed</span></div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{employee.actionsPerformed}</p>
              </Card>
            </div>
          </div>

          {/* Metrics */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Key Metrics</h3>
            </div>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {employee.metrics.map((m) => (
                  <div key={m.label} className="text-center py-3 border border-slate-100 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{m.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="animate-fade-in">
          <Card className="overflow-hidden">
            <div className="divide-y divide-slate-50">
              {empTasks.length > 0 ? empTasks.map((task) => {
                const tStatus = taskStatusConfig[task.status];
                return (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{task.description}</p>
                    </div>
                    <div className="hidden sm:block text-xs text-slate-400 w-20">{task.started}</div>
                    <div className="hidden sm:block text-xs text-slate-400 w-16">{task.duration}</div>
                    <div className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0', tStatus.bg, tStatus.text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', tStatus.dot)} />
                      {tStatus.label}
                    </div>
                  </div>
                );
              }) : (
                <div className="py-16 text-center text-sm text-slate-400">No tasks yet</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="animate-fade-in">
          <Card className="overflow-hidden">
            <div className="divide-y divide-slate-50">
              {empActivity.length > 0 ? empActivity.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="text-xs text-slate-400 font-mono w-16 flex-shrink-0">{entry.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{entry.action} <span className="font-medium">{entry.target}</span></p>
                  </div>
                  {entry.result === 'success' && <Badge variant="success" dot dotColor="bg-emerald-500">Success</Badge>}
                  {entry.result === 'warning' && <Badge variant="warning" dot dotColor="bg-amber-500">Review</Badge>}
                  {entry.result === 'error' && <Badge variant="error" dot dotColor="bg-red-500">Failed</Badge>}
                </div>
              )) : (
                <div className="py-16 text-center text-sm text-slate-400">No activity yet</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Knowledge Tab */}
      {activeTab === 'knowledge' && (
        <div className="animate-fade-in">
          <Card className="p-6 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-900">No knowledge sources connected</p>
            <p className="text-sm text-slate-500 mt-1">Connect knowledge sources to help this employee work more effectively.</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('knowledge')}>Manage Knowledge</Button>
          </Card>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {employee.tools.map((tool) => (
              <Card key={tool.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                      {tool.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                      <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Connected</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('integrations')}>Browse all integrations</Button>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="animate-fade-in space-y-4">
          <Card className="p-4">
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <p className="text-sm text-brand-700">You stay in control. Sensitive actions require your approval.</p>
            </div>
          </Card>
          {[
            { title: 'Read', items: ['View CRM', 'Read customer information', 'Read company knowledge', 'View analytics'], enabled: [true, true, true, true] },
            { title: 'Create', items: ['Create leads', 'Create tasks', 'Create drafts'], enabled: [true, true, true] },
            { title: 'Execute', items: ['Send emails (approval required)', 'Modify CRM records (approval required)', 'Schedule meetings'], enabled: [true, false, false] },
          ].map((group) => (
            <Card key={group.title} className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{item}</span>
                    <Toggle checked={group.enabled[i]} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card className="p-4 border-red-200">
            <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Restricted</h3>
            <div className="space-y-3">
              {['Delete customer data', 'Issue refunds', 'Transfer money'].map((item) => (
                <div key={item} className="flex items-center justify-between opacity-60">
                  <span className="text-sm text-slate-700">{item}</span>
                  <span className="text-xs text-red-600 font-medium">🔒 Locked</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="animate-fade-in space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Employee Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-slate-900">Auto-pause on errors</p><p className="text-xs text-slate-500">Pause employee after 3 consecutive failures</p></div>
                <Toggle checked={true} onChange={() => showToast('info', 'Setting updated')} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-slate-900">Require approval for sends</p><p className="text-xs text-slate-500">Require human approval before sending emails</p></div>
                <Toggle checked={true} onChange={() => showToast('info', 'Setting updated')} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-slate-900">Activity notifications</p><p className="text-xs text-slate-500">Get notified of key actions</p></div>
                <Toggle checked={true} onChange={() => showToast('info', 'Setting updated')} />
              </div>
            </div>
          </Card>
          <Card className="p-5 border-red-200">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-500 mb-4">Permanently remove this employee and all its data.</p>
            <Button variant="danger" size="sm" onClick={() => { showToast('info', 'Confirmation required to delete employee'); }}>Delete Employee</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
