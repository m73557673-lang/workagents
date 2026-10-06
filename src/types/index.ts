export type EmployeeStatus = 'working' | 'idle' | 'paused' | 'needs_approval' | 'error';
export type EmployeeRole = 'sales' | 'support' | 'marketing' | 'finance' | 'operations' | 'custom';

export interface Tool {
  id: string;
  name: string;
  connected: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  roleType: EmployeeRole;
  status: EmployeeStatus;
  description: string;
  avatarColor: string;
  tasksCompleted: number;
  successRate: number;
  timeSavedHours: number;
  actionsPerformed: number;
  currentTask: string;
  taskProgress: number;
  lastActive: string;
  tools: Tool[];
  metrics: { label: string; value: string }[];
  taskSteps: { label: string; status: 'done' | 'current' | 'pending' }[];
}

export type ApprovalRisk = 'low' | 'medium' | 'high';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Approval {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  reason: string;
  impact: string;
  risk: ApprovalRisk;
  status: ApprovalStatus;
  timestamp: string;
}

export type TaskStatus = 'running' | 'completed' | 'failed' | 'waiting_approval';
export type TaskResult = 'success' | 'partial' | 'failed' | 'pending';

export interface Task {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeColor: string;
  title: string;
  description: string;
  status: TaskStatus;
  result: TaskResult;
  started: string;
  duration: string;
  progress: number;
}

export interface ActivityEntry {
  id: string;
  time: string;
  employeeId: string;
  employeeName: string;
  action: string;
  target: string;
  result: 'success' | 'warning' | 'error';
  risk: ApprovalRisk;
  category: 'employee' | 'task' | 'approval' | 'automation';
}

export type IntegrationCategory =
  | 'crm' | 'communication' | 'productivity' | 'finance' | 'support' | 'marketing' | 'developer';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  connected: boolean;
  iconColor: string;
  initials: string;
}

export type AutomationStatus = 'active' | 'paused' | 'draft';

export interface AutomationStep {
  id: string;
  label: string;
  type: 'trigger' | 'action' | 'approval' | 'output';
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: AutomationStatus;
  trigger: string;
  steps: AutomationStep[];
  runsThisWeek: number;
  lastRun: string;
}

export type KnowledgeType = 'document' | 'website' | 'faq' | 'policy' | 'product';
export type KnowledgeStatus = 'indexed' | 'indexing' | 'failed';

export interface KnowledgeSource {
  id: string;
  name: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  lastUpdated: string;
  size: string;
  items: number;
}

export interface Notification {
  id: string;
  type: 'approval' | 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; type: string }[];
  timestamp: string;
}
