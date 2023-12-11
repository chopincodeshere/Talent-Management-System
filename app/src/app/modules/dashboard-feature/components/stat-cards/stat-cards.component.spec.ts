import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardsComponent } from './stat-cards.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('StatCardsComponent', () => {
  let component: StatCardsComponent;
  let fixture: ComponentFixture<StatCardsComponent>;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule],
      declarations: [ StatCardsComponent ],
      providers: [
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCardsComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openComponent', () => {
    it('should navigate to /candidate-pool/all-candidates/search when data.key is 1', () => {
      // Arrange
      component.data = { key: 1, title: '', count: 0 };

      // Act
      component.openComponent();

      // Assert
      expect(router.navigateByUrl).toHaveBeenCalledWith('/candidate-pool/all-candidates/search');
    });

    it('should navigate to /interview/jobs when data.key is 2', () => {
      // Arrange
      component.data = { key: 2, title: '', count: 0 };

      // Act
      component.openComponent();

      // Assert
      expect(router.navigateByUrl).toHaveBeenCalledWith('/interview/jobs');
    });

    it('should navigate to /dashboard/{key} when data.key is 3, 4, 5, 6, or 7', () => {
      // Arrange
      const keys = [3, 4, 5, 6, 7];
      const expectedRoute = (key: number) => (key >= 3 && key <= 7) ? `dashboard/${key}/search` : `dashboard/${key}`;
    
      // Act
      keys.forEach(key => {
        component.data = { key, title: '', count: 0 };
        component.openComponent();
      });
    
      // Assert
      keys.forEach(key => {
        expect(router.navigateByUrl).toHaveBeenCalledWith(expectedRoute(key));
      });
    });

    it('should navigate to /dashboard when data.key is not 1, 2, 3, 4, 5, 6, or 7', () => {
      // Arrange
      component.data = { key: 8, title: '', count: 0 };

      // Act
      component.openComponent();

      // Assert
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });
  });
});
