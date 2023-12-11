export interface CandidateResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobPosition: {
    jobTitle: string;
    hiringManager: string[];
    jobStatus: string;
  };
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
  currentCTC: string;
  expectedCTC: string;
  currentNoticePeriod: string;
  totalExperience: string;
  enrolledDate: Date;
  source: string;
  skills: string[];
  mayKnowSkills: string[];
  mobilePhone: string;
  candidateCode: string;
  education: {
    highestDegree: string;
    specialization: string;
    yearOfAchievement: Date;
  };
  workMode: string;
  round: number;
  stage?: string;
  feedbackLength?: number;
}
