import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateRegistrationFormComponent } from './candidate-registration-form.component';
import { ResumeUploadComponent } from './subcomponents/resume-upload/resume-upload.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('CandidateRegistrationFormComponent', () => {
  let component: CandidateRegistrationFormComponent;
  let fixture: ComponentFixture<CandidateRegistrationFormComponent>;
  let router: Router;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NgMultiSelectDropDownModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [CandidateRegistrationFormComponent, ResumeUploadComponent], 
      teardown: {destroyAfterEach: false} 
    }).compileComponents();

    formBuilder = new FormBuilder();
    formGroup = formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^([A-Z].*)$')]],
      lastName: ['', [Validators.required, Validators.pattern('^([A-Z].*)$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.(com|net|org|edu|in)$'
          ),
        ],
      ],
      address: formBuilder.group({
        currentAddress: formBuilder.group({
          currentCountry: ['', Validators.required],
          currentState: ['', Validators.required],
          currentCity: ['', Validators.required],
        }),
        permanentAddress: formBuilder.group({
          permanentCountry: ['', Validators.required],
          permanentState: ['', Validators.required],
          permanentCity: ['', Validators.required],
        }),
      }),
      mobilePhone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      links: formBuilder.array([]),
      employment: formBuilder.array([
        formBuilder.group({
          companyName: '',
          designation: '',
          previousCTC: '',
          location: '',
          workingStatus: 'Working',
          start: '',
          finish: '',
        }),
      ]),
      education: formBuilder.group({
        highestDegree: ['', Validators.required],
        specialization: ['', Validators.required],
        yearOfAchievement: ['', Validators.required],
      }),
      source: ['', Validators.required],
      referral: formBuilder.group({
        referred_fname: '',
        referred_lname: '',
      }),
      note: '',
      resume: [''],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegistrationFormComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // Test Cases
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should return the firstName control', () => {
      expect(component.firstName).toEqual(component.referBuddyForm.get('firstName'));
    });
  
    it('should return the lastName control', () => {
      expect(component.lastName).toEqual(component.referBuddyForm.get('lastName'));
    });
  
    it('should return the email control', () => {
      expect(component.email).toEqual(component.referBuddyForm.get('email'));
    });
  
    it('should return the mobilePhone control', () => {
      expect(component.mobilePhone).toEqual(component.referBuddyForm.get('mobilePhone'));
    });
  
    it('should return the highestDegree control', () => {
      expect(component.highestDegree).toEqual(component.referBuddyForm.get('education')!.get('highestDegree'));
    });
  
    it('should return the specialization control', () => {
      expect(component.specialization).toEqual(component.referBuddyForm.get('education')!.get('specialization'));
    });
  
    it('should return the yearOfAchievement control', () => {
      expect(component.yearOfAchievement).toEqual(component.referBuddyForm.get('education')!.get('yearOfAchievement'));
    });
  
    it('should return the source control', () => {
      expect(component.source).toEqual(component.referBuddyForm.get('source'));
    });
  
    it('should return the note control', () => {
      expect(component.note).toEqual(component.referBuddyForm.get('note'));
    });
  
    it('should return the referred_fname control', () => {
      expect(component.referred_fname).toEqual(component.referBuddyForm.get('referral')!.get('referred_fname'));
    });
  
    it('should return the referred_lname control', () => {
      expect(component.referred_lname).toEqual(component.referBuddyForm.get('referral')!.get('referred_lname'));
    });
  });

  describe('Candidate Registration Form Validations failed', () => {
    it('should be invalid if any control is invalid', () => {
      setFormValues({
        firstName: '',
        lastName: '',
        email: 'invalid email',
        address: {
          currentAddress: {
            currentCountry: '',
            currentState: '',
            currentCity: '',
          },
          permanentAddress: {
            permanentCountry: '',
            permanentState: '',
            permanentCity: '',
          },
        },
        mobilePhone: '1234567890',
        employment: [
          {
            companyName: '',
            designation: '',
            previousCTC: '',
            location: '',
            workingStatus: '',
            start: '',
            finish: '',
          },
        ],
        education: {
          highestDegree: '',
          specialization: '',
          yearOfAchievement: '',
        },
        source: '',
        referral: {
          referred_fname: '',
          referred_lname: '',
        },
        note: '',
        resume: '',
      });

      expect(formGroup.valid).toBeFalsy();
    });
  });

  describe('Candidate Registration Form Validations passed', () => {
    it('should be valid if every control is valid', () => {
      setFormValues({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johnDoe@email.com',
        address: {
          currentAddress: {
            currentCountry: 'India',
            currentState: 'Punjab',
            currentCity: 'Amritsar',
          },
          permanentAddress: {
            permanentCountry: 'India',
            permanentState: 'Bihar',
            permanentCity: 'Siwan',
          },
        },
        mobilePhone: '1234567890',
        employment: [
          {
            companyName: 'TechCompany Pvt. Ltd.',
            designation: 'Project Manager',
            previousCTC: '12',
            location: 'Amritsar',
            workingStatus: 'Currently working',
            start: '12-02-2018',
            finish: '',
          },
        ],
        education: {
          highestDegree: 'Masters in Engineering',
          specialization: 'Computer Science',
          yearOfAchievement: '06-05-2016',
        },
        source: 'Newspaper',
        referral: {
          referred_fname: 'Aniket',
          referred_lname: 'Chauhan',
        },
        note: '',
        resume: new File(['content'], 'Sample.pdf', {
          type: 'application/pdf',
        }),
      });

      expect(formGroup.valid).toBeTruthy();
    });
  });


  describe('_filterDegrees', () => {
    it('should return degrees starting with "Bachelor" when value is "Bachelor"', () => {
      const value = 'Bachelor';
      const filteredDegrees = component['_filterDegrees'](value);
      expect(filteredDegrees).toEqual([
        'Bachelor of Arts (BA)',
        'Bachelor of Science (BSc)',
        'Bachelor of Commerce (BCom)',
        'Bachelor of Engineering (BE)',
        'Bachelor of Technology (BTech)',
        'Bachelor of Business Administration (BBA)',
        'Bachelor of Computer Applications (BCA)',
        'Bachelor of Architecture (BArch)',
        'Bachelor of Pharmacy (BPharm)',
        'Bachelor of Education (BEd)',
        'Bachelor of Law (LLB)',
        'Bachelor of Fine Arts (BFA)'
      ]);
    });

    it('should return degrees starting with "Master" when value is "master"', () => {
      const value = 'master';
      const filteredDegrees = component['_filterDegrees'](value);
      expect(filteredDegrees).toEqual([
        'Master of Arts (MA)',
        'Master of Science (MSc)',
        'Master of Commerce (MCom)',
        'Master of Engineering (ME)',
        'Master of Technology (MTech)',
        'Master of Business Administration (MBA)',
        'Master of Computer Applications (MCA)',
        'Master of Architecture (MArch)',
        'Master of Pharmacy (MPharm)',
        'Master of Education (MEd)',
        'Master of Law (LLM)',
        'Master of Fine Arts (MFA)'
      ]);
    });
    
  });

  xdescribe('_filterSpecializations', () => {
    it('should return an array of matching specializations', () => {
      const result = component['_filterSpecializations']('Computer Science');
      expect(result).toEqual(['Computer Science']);
    });

    it('should return specializations starting with "Fin" when value is "fin"', () => {
      const value = 'fin';
      const filteredSpecializations = component['_filterSpecializations'](value);
      expect(filteredSpecializations).toEqual([
        'Finance',
        'Fine Arts'
      ]);
    });
    
  });

  describe('validateEducation()', () => {
    it('should return true if any of the education form controls is invalid', () => {
      component.highestDegree!.setErrors({ invalid: true });
      component.specialization!.setErrors({ invalid: true });
      component.yearOfAchievement!.setErrors({ invalid: true });

      const result = component.validateEducation();

      expect(result).toBeTrue();
    });

    it('should return false if all of the education form controls are valid', () => {
      component.highestDegree!.setErrors(null);
      component.specialization!.setErrors(null);
      component.yearOfAchievement!.setErrors(null);

      const result = component.validateEducation();

      expect(result).toBeFalse();
    });

    it('should return true if any of the education form controls are touched and invalid', () => {
      component.highestDegree!.markAsTouched();
      component.highestDegree!.setErrors({ invalid: true });
      component.specialization!.setErrors(null);
      component.yearOfAchievement!.setErrors(null);

      const result = component.validateEducation();

      expect(result).toBeTrue();
    });
  });

  describe('addEmploymentHistory()', () => {
    it('should add a new employment history to the form array', () => {
      pending();
    });
  });

  describe('addEmployment', () => {
    it('should add a new employment history to the form array', () => {
      pending();
    });
  });

  describe('removeEmployment', () => {
    it('should remove the employment history at the specified index from the form array', () => {
      pending();
    });
  });

  describe('onClick', () => {
    it('should set the resume and formdata in sessionStorage', () => {
      const setResumeSpy = spyOn(component, 'setResume');
      const setItemSpy = spyOn(sessionStorage, 'setItem');
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

      const formValue = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johnDoe@email.com',

        address: {
          currentAddress: {
            currentCountry: 'India',
            currentState: 'Punjab',
            currentCity: 'Amritsar',
          },
          permanentAddress: {
            permanentCountry: 'India',
            permanentState: 'Bihar',
            permanentCity: 'Siwan',
          },
        },
        mobilePhone: '1234567890',
        links: [],
        employment: [
          {
            companyName: 'TechCompany Pvt. Ltd.',
            designation: 'Project Manager',
            previousCTC: '12',
            location: 'Amritsar',
            workingStatus: 'Currently working',
            start: '12-02-2018',
            finish: '',
          },
        ],
        education: {
          highestDegree: 'Masters in Engineering',
          specialization: 'Computer Science',
          yearOfAchievement: '06-05-2016',
        },
        source: 'Newspaper',
        referral: {
          referred_fname: 'Aniket',
          referred_lname: 'Chauhan',
        },
        note: '',
        resume: new File(['content'], 'Sample.pdf'),
      };

      component.referBuddyForm.setValue(formValue);

       component.onClick();

    expect(setResumeSpy).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalledWith(
      'formdata',
      JSON.stringify(formValue)
    );
    expect(component.checkFormValidation()).toBe(true);
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/candidate-pool/add-candidate/more-details');
    });
  });

  // Helper Functions
  function setFormValues(values: { [key: string]: any }) {
    Object.keys(values).forEach((key) => {
      formGroup.get(key)?.setValue(values[key]);
    });
  }
});
