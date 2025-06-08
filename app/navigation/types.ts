import { Job } from '@/types';

export type RootStackParamList = {
  Main: undefined;
  JobDetails: { job: Job };
  ExportResume: undefined;
};

export type MainTabParamList = {
  Jobs: undefined;
  Applications: undefined;
  Profile: undefined;
};
