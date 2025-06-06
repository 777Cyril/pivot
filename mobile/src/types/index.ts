export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'rejected' | 'saved' | 'prioritized';
  createdAt: string;
}
