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
