import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

interface Employment {
  companyName: string;
  designation: string;
  previousCTC: string;
  location: string;
  workingStatus: string;
  start: Date;
  finish: Date;
}

interface Candidate {
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
  resume: File;
  keySkills: Array<string>;
  mayKnowSkills: Array<string>;
  totalExperience: string;
  currentCTC: string;
  expectedCTC: string;
  currentNoticePeriod: string;
  positionAppliedFor: string;
  workMode: string;
  communicationSkills: string;
}

let testUrl = "/candidate-pool/candidates"

describe('Http Client Testing module', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
  });

  it('should call the testUrl with get request', () => {
    // httpClient.get<Candidate>(testUrl).subscribe();
    pending();
  });
});
