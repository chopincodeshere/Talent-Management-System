import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMainComponent } from './dashboard-main.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { StatCardsComponent } from '../stat-cards/stat-cards.component';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobService } from 'src/app/services/job-service/job.service';
import { of } from 'rxjs';

describe('DashboardMainComponent', () => {
  let component: DashboardMainComponent;
  let fixture: ComponentFixture<DashboardMainComponent>;
  let candidateService: CandidateService;
  let jobService: JobService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientTestingModule],
      providers: [CandidateService, JobService],
      declarations: [DashboardMainComponent, StatCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMainComponent);
    candidateService = TestBed.inject(CandidateService);
    jobService = TestBed.inject(JobService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createPieChart', () => {
    beforeEach(async () => {
      // Clean up: Destroy the chart
      component.pieChart.destroy();
    });

    it('should create a pie chart', () => {
      component.pieChartLabels = ['Label 1', 'Label 2', 'Label 3', 'Label 4'];
      component.pieChartData = [10, 20, 30, 40];
      component.createPieChart();

      // Assert that the Chart instance is created
      expect(component.pieChart).toBeDefined();

      // Assert the type of the chart
      expect(component.pieChart.config.type).toEqual('doughnut');

      // Assert the labels and data of the chart
      expect(component.pieChart.config.data.labels).toEqual([
        'Label 1',
        'Label 2',
        'Label 3',
        'Label 4',
      ]);
      expect(component.pieChart.config.data.datasets[0].data).toEqual([
        10, 20, 30, 40,
      ]);

      // Assert the background colors of the chart
      expect(
        component.pieChart.config.data.datasets[0].backgroundColor
      ).toEqual([
        'rgb(41, 128, 185)',
        'rgb(231, 76, 60)',
        'rgb(155, 89, 182)',
        'rgb(39, 174, 96)',
      ]);

      // Assert the hover offset of the chart
      expect(component.pieChart.config.data.datasets[0].hoverOffset).toEqual(4);
    });
  });

  describe('getTotalNumberOfCandidates', () => {
    it('should update the count for key 1 in cardData when calling getTotalNumberOfCandidates', () => {
      const response = 10; // Sample response value

      // Set up spy on candidateService.getTotalNumberOfRecords and return the sample response
      spyOn(candidateService, 'getTotalNumberOfRecords').and.returnValue(
        of(response)
      );

      component.getTotalNumberOfCandidates();

      // Verify that cardData count is updated correctly for key 1
      expect(component.cardData.find((card) => card.key === 1)?.count).toBe(
        response
      );
    });
  });
  
});
