export interface JobResponse {
  jobCount?: number;
  id: number;
  jobTitle: string;
  hiringManagers: string[];
  requirements: string;
  jobStatus: string;
  jobDescription: File | null;
}
