import type { EmployeeStatus, ApprovalRisk, TaskStatus, ApprovalStatus, KnowledgeStatus, AutomationStatus } from '@/types';

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const statusConfig: Record<EmployeeStatus, { label: string; dot: string; text: string; bg: string }> = {
  working: { label: 'Working', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  idle: { label: 'Idle', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
  paused: { label: 'Paused', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  needs_approval: { label: 'Needs Approval', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  error: { label: 'Error', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
};

export const riskConfig: Record<ApprovalRisk, { label: string; dot: string; text: string; bg: string; border: string }> = {
  low: { label: 'Low', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  medium: { label: 'Medium', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  high: { label: 'High', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

export const taskStatusConfig: Record<TaskStatus, { label: string; dot: string; text: string; bg: string }> = {
  running: { label: 'Running', dot: 'bg-blue-500 animate-pulse', text: 'text-blue-700', bg: 'bg-blue-50' },
  completed: { label: 'Completed', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  failed: { label: 'Failed', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  waiting_approval: { label: 'Waiting for Approval', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
};

export const approvalStatusConfig: Record<ApprovalStatus, { label: string; text: string; bg: string }> = {
  pending: { label: 'Pending', text: 'text-amber-700', bg: 'bg-amber-50' },
  approved: { label: 'Approved', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  rejected: { label: 'Rejected', text: 'text-red-700', bg: 'bg-red-50' },
  expired: { label: 'Expired', text: 'text-slate-600', bg: 'bg-slate-100' },
};

export const knowledgeStatusConfig: Record<KnowledgeStatus, { label: string; text: string; bg: string; dot: string }> = {
  indexed: { label: 'Indexed', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  indexing: { label: 'Indexing...', text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500 animate-pulse' },
  failed: { label: 'Failed', text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

export const automationStatusConfig: Record<AutomationStatus, { label: string; text: string; bg: string; dot: string }> = {
  active: { label: 'Active', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  paused: { label: 'Paused', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  draft: { label: 'Draft', text: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
};

export const avatarColors: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  slate: 'bg-slate-100 text-slate-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return n.toString();
}
