import { Injectable } from '@angular/core';
import { Candidate } from '../../core/models/candidate';
import { faker } from '@faker-js/faker';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';

@Injectable({
  providedIn: 'root',
})
export class FakeDataService {
  constructor(private candidateService: CandidateService) {}

  getFile(): any {
    const reader = new FileReader();

    let base64;
    reader.onload = function () {
      base64 = btoa(reader.result as string);
    };

    reader.readAsBinaryString(new File([], 'result.pdf'));

    return base64;
  }

  generateRandomCandidateFeedback(length: number): any[] {
    const feedbacks: any[] = [];

    for (let i = 0; i < length; i++) {
      const feedback = {
        candidateName: faker.name.firstName() + ' ' + faker.name.lastName(),
        dateOfInterview: faker.date.recent(),
        positionAppliedFor: faker.datatype.number({ min: 1, max: 5 }),
        interviewer: faker.helpers.arrayElement([
          'Jaydeep Chhasatia',
          'Ashish Patel',
          'Mickeal A.',
          'Cristian Oancea',
          'Dan Mihalache',
          'Ankur Gupta',
          'Gianluca La Brusco',
        ]),
        round: faker.datatype.number({ min: 1, max: 3 }),
        educationalBackgroundRating: faker.datatype.number({ min: 1, max: 10 }),
        workExperienceRating: faker.datatype.number({ min: 1, max: 10 }),
        technicalSkillsRating: faker.datatype.number({ min: 1, max: 10 }),
        communicationSkillsRating: faker.datatype.number({ min: 1, max: 10 }),
        candidateInterestRating: faker.datatype.number({ min: 1, max: 10 }),
        interpersonalSkillsRating: faker.datatype.number({ min: 1, max: 10 }),
        overallRating: faker.datatype.number({ min: 1, max: 10 }),
        comments: faker.lorem.paragraph(),
        result: faker.helpers.arrayElement([
          'Shortlisted',
          'On hold',
          'Rejected - Below the average rating - but can be approached in Future',
          'Rejected - Poor Rating',
        ]),
      };

      feedbacks.push(feedback);
    }

    return feedbacks;
  }

  generateFakeCandidate(): Candidate {
    const employment = [
      {
        companyName: faker.company.name(),
        designation: faker.name.jobTitle(),
        previousCTC: faker.helpers.arrayElement([
          `${faker.random.numeric(1)}`,
          `${faker.random.numeric(2)}`,
        ]),
        location: faker.address.city(),
        workingStatus: faker.helpers.arrayElement([`Fresher`, 'Working']),
        start: faker.date.past(10),
        finish: faker.date.past(5),
      },
      {
        companyName: faker.company.name(),
        designation: faker.name.jobTitle(),
        previousCTC: faker.helpers.arrayElement([
          `${faker.random.numeric(1)}`,
          `${faker.random.numeric(2)}`,
        ]),
        location: faker.address.city(),
        workingStatus: faker.helpers.arrayElement([`Fresher`, 'Working']),
        start: faker.date.past(10),
        finish: faker.date.past(5),
      },
    ];

    const candidate: Candidate = {
      id: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      address: {
        currentAddress: {
          currentCountry: faker.address.country(),
          currentState: faker.address.state(),
          currentCity: faker.address.city(),
        },
        permanentAddress: {
          permanentCountry: faker.address.country(),
          permanentState: faker.address.state(),
          permanentCity: faker.address.city(),
        },
      },
      mobilePhone: faker.phone.number('9876543210'),
      links: [faker.random.word(), faker.random.word(), faker.random.word()],
      employment,
      education: {
        highestDegree: faker.helpers.arrayElement([
          'Bachelor of Engineering',
          'Master of Engineering',
        ]),
        specialization: faker.random.word(),
        yearOfAchievement: faker.date.past(10),
      },
      source: faker.helpers.arrayElement([
        'Newspaper',
        'Reffered by a friend',
        'Magazine',
        'LinkedIn',
        faker.random.word(),
      ]),
      referral: {
        referred_fname: faker.name.firstName(),
        referred_lname: faker.name.lastName(),
      },
      note: faker.lorem.sentence(),
      resume: this.getFile(),
      keySkills: [
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
      ],
      mayKnowSkills: [
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
        faker.helpers.arrayElement([
          'HTML',
          'CSS',
          'JavaScript',
          'Java',
          'C',
          'C++',
          'C#',
          'Python',
          'Go',
          'R',
          'PHP',
          'React',
          'Angular',
          'MongoDB',
          '.NET',
        ]),
      ],
      totalExperience: `${faker.datatype.number(20)}`,
      currentCTC: faker.helpers.arrayElement([
        `${faker.random.numeric(1)}`,
        `${faker.random.numeric(2)}`,
      ]),
      expectedCTC: faker.helpers.arrayElement([
        `${faker.random.numeric(1)}`,
        `${faker.random.numeric(2)}`,
      ]),
      currentNoticePeriod: `${faker.datatype.number({ min: 1, max: 4 })} month`,
      job_id: faker.datatype.number({ min: 1, max: 6 }),
      workMode: faker.helpers.arrayElement(['Onsite', 'Remote', 'Hybrid']),
      communicationSkills: faker.random.numeric(1),
      round: faker.datatype.number({ min: 1, max: 3 }),
      stage: faker.helpers.arrayElement(['On Hold', 'Hired', 'Rejected', 'Inactive']),
      // stage: 'Hired',
      candidateFeedback: this.generateRandomCandidateFeedback(
        faker.datatype.number({ min: 1, max: 3 })
      ),
    };

    return candidate;
  }

  // Generate an array of fake Candidate objects
  generateFakeCandidates(count: number): Candidate[] {
    const candidates: Candidate[] = [];

    for (let i = 0; i < count; i++) {
      // candidates.push(this.generateFakeCandidate());
      this.candidateService
        .addCandidate(this.generateFakeCandidate())
        .subscribe((response: any) => {});
      // console.log(candidates);
    }

    return candidates;
  }
}
