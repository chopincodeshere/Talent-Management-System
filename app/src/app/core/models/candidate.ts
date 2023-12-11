import { CandidateFeedback } from './CandidateFeedback';
import { Employment } from './employment';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    currentAddress: {
      currentCountry: string;
      currentState: string;
      currentCity: string;
    };
    permanentAddress: {
      permanentCountry: string;
      permanentState: string;
      permanentCity: string;
    };
  };
  mobilePhone: string;
  links: Array<string>;
  employment: Employment[];
  education: {
    highestDegree: string;
    specialization: string;
    yearOfAchievement: Date;
  };
  source: string;
  referral: {
    referred_fname: string;
    referred_lname: string;
  };
  note: string;
  notesByInterviewer?: string;
  resume: File | null;
  keySkills: Array<string>;
  mayKnowSkills: Array<string>;
  totalExperience: string;
  currentCTC: string;
  expectedCTC: string;
  currentNoticePeriod: string;
  job_id: number;
  workMode: string;
  communicationSkills: string;
  round?: number;
  stage: string;
  candidateFeedback?: CandidateFeedback[];
}
