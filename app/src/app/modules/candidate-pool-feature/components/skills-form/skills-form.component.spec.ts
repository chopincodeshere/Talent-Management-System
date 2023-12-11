import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkillsFormComponent } from './skills-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { of } from 'rxjs';
import { Candidate } from 'src/app/core/models/candidate';

describe('SkillsFormComponent', () => {
  let component: SkillsFormComponent;
  let candidateServiceSpy: jasmine.SpyObj<CandidateService>;
  let fixture: ComponentFixture<SkillsFormComponent>;

  beforeEach(async () => {
    candidateServiceSpy = jasmine.createSpyObj('CandidateService', [
      'addCandidate',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [SkillsFormComponent],
      providers: [{ provide: CandidateService, useValue: candidateServiceSpy }],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should get totalExperience', () => {
      const totalExperience = component.totalExperience;
      expect(component.totalExperience).toEqual(
        component.moreDetails.get('totalExperience')
      );
      expect(totalExperience).not.toBeNull();
    });

    it('should get currentCTC', () => {
      const currentCTC = component.currentCTC;
      expect(component.currentCTC).toEqual(
        component.moreDetails.get('currentCTC')
      );
      expect(currentCTC).not.toBeNull();
    });

    it('should get expectedCTC', () => {
      const expectedCTC = component.expectedCTC;
      expect(component.expectedCTC).toEqual(
        component.moreDetails.get('expectedCTC')
      );

      expect(expectedCTC).not.toBeNull();
    });

    it('should get currentNoticePeriod', () => {
      const currentNoticePeriod = component.currentNoticePeriod;
      expect(component.currentNoticePeriod).toEqual(
        component.moreDetails.get('currentNoticePeriod')
      );
      expect(currentNoticePeriod).not.toBeNull();
    });

    it('should get workMode', () => {
      const workMode = component.workMode;
      expect(component.workMode).toEqual(component.moreDetails.get('workMode'));

      expect(workMode).not.toBeNull();
    });

    it('should get communicationSkills', () => {
      const communicationSkills = component.communicationSkills;
      expect(component.communicationSkills).toEqual(
        component.moreDetails.get('communicationSkills')
      );

      expect(communicationSkills).not.toBeNull();
    });
  });

  describe('addSkill', () => {
    it('should add a skill to the skills array', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addSkill(event as any);
      expect(component.skills).toContain('test skill');
      expect(event.chipInput.clear).toHaveBeenCalled();
    });

    it('should clear the input value', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addSkill(event as any);
      expect(component.skillCtrl.value).toBeNull();
    });
  });

  describe('addMoreSkill', () => {
    it('should add a skill to the moreSkills array', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addMoreSkill(event as any);
      expect(component.moreSkills).toContain('test skill');
      expect(event.chipInput.clear).toHaveBeenCalled();
    });

    it('should clear the input value', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addMoreSkill(event as any);
      expect(component.moreSkillCtrl.value).toBeNull();
    });
  });

  describe('removeSkill', () => {
    it('should remove a skill from the skills array', () => {
      component.skills = ['test skill'];
      component.removeSkill('test skill');
      expect(component.skills).not.toContain('test skill');
    });
  });

  describe('removeMoreSkill', () => {
    it('should remove a skill from the moreSkills array', () => {
      component.moreSkills = ['test skill'];
      component.removeMoreSkill('test skill');
      expect(component.moreSkills).not.toContain('test skill');
    });
  });

  describe('selectedSkill', () => {
    it('should add a selected skill to the skills array', () => {
      const event = { option: { viewValue: 'test skill' } };
      component.selectedSkill(event as any);
      expect(component.skills).toContain('test skill');
    });
  });

  describe('selectedMoreSkill', () => {
    it('should add a selected skill to the moreSkills array', () => {
      const event = { option: { viewValue: 'test skill' } };
      component.selectedMoreSkill(event as any);
      expect(component.moreSkills).toContain('test skill');
    });
  });

  describe('_filter()', () => {
    it('should return a filtered list of skills', () => {
      // Arrange
      component.allSkills = ['JavaScript', 'TypeScript', 'HTML', 'CSS'];
      const value = 'Script';

      // Act
      const result = (component as any)._filter(value);

      // Assert
      expect(result).toEqual(['JavaScript', 'TypeScript']);
    });
  });

  
});
