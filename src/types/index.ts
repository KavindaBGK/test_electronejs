import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  icon: ReactNode;
}

export interface User {
  id: string;
  name: string;
  initials: string;
}

export interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  completed?: boolean;
}

export interface Activity {
  id: number;
  initial: string;
  title: string;
  description: string;
  time: string;
}

// Plugin interfaces
export interface PluginMenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: string;
  children?: PluginMenuItem[];
}

export interface PluginMenuResponse {
  items: PluginMenuItem[];
  success: boolean;
  error?: string;
}

export interface PluginInterface {
  getMenuItems: () => Promise<PluginMenuResponse>;
  executeAction: (actionId: string, params?: any) => Promise<any>;
}
