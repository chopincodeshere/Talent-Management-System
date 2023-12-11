import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { JobService } from 'src/app/services/job-service/job.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas: ElementRef;

  pieChart: any;

  pieChartData: Array<number> = [];
  pieChartLabels = ['Hired', 'On-Hold', 'Rejected', 'Inactive'];

  cardData: { key: number; title: string; count: number }[] = [
    { key: 1, title: 'Total Candidates', count: 0 },
    { key: 2, title: 'Open positions', count: 0 },
    { key: 3, title: 'Shortlisted Candidates', count: 0 },
    { key: 4, title: 'Hired Candidates', count: 0 },
    { key: 5, title: 'On-Hold Candidates', count: 0 },
    { key: 6, title: 'Rejected Candidates', count: 0 },
    { key: 7, title: 'Inactive Candidates', count: 0 },
  ];

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.fetchAllData();
  }

  ngAfterViewInit() {}

  fetchAllData() {
    const getTotalCandidates$ = this.candidateService.getTotalNumberOfRecords();
    const getJobPositions$ = this.jobService.getTotalJobCount();
    const getShortlistedCandidates$ =
      this.candidateService.getNumberOfShortlistedCandidates();
    const getHiredCandidates$ =
      this.candidateService.getNumberOfHiredCandidates();
    const getRejectedCandidates$ =
      this.candidateService.getNumberOfRejectedCandidates();
    const getOnHoldCandidates$ =
      this.candidateService.getNumberOfOnHoldCandidates();
    const getInactiveCandidates$ =
      this.candidateService.getNumberOfInactiveCandidates();

    forkJoin([
      getTotalCandidates$,
      getJobPositions$,
      getShortlistedCandidates$,
      getHiredCandidates$,
      getRejectedCandidates$,
      getOnHoldCandidates$,
      getInactiveCandidates$,
    ]).subscribe(
      ([
        totalCandidates,
        jobPositions,
        shortlistedCandidates,
        hiredCandidates,
        rejectedCandidates,
        onHoldCandidates,
        inactiveCandidates,
      ]) => {
        this.cardData.find((card) => card.key === 1)!.count = totalCandidates;
        this.cardData.find((card) => card.key === 2)!.count = jobPositions;
        this.cardData.find((card) => card.key === 3)!.count =
          shortlistedCandidates;
        this.cardData.find((card) => card.key === 4)!.count = hiredCandidates;
        this.cardData.find((card) => card.key === 5)!.count =
          rejectedCandidates;
        this.cardData.find((card) => card.key === 6)!.count = onHoldCandidates;
        this.cardData.find((card) => card.key === 7)!.count =
          inactiveCandidates;

        this.createPieChart();
      }
    );
  }

  updateChart() {
    this.pieChart.data.datasets[0].data = this.pieChartData;
    this.pieChart.update();
  }

  createPieChart() {
    const canvas = this.pieChartCanvas.nativeElement.getContext('2d');

    // Extract counts from cardData
    const counts = this.cardData
      .filter((card) => [4, 5, 6, 7].includes(card.key))
      .map((card) => card.count);

    this.pieChartData = counts; // Assign counts to pieChartData

    this.pieChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.pieChartLabels,
        datasets: [
          {
            label: 'Candidates data',
            data: this.pieChartData,
            backgroundColor: [
              'rgb(41, 128, 185)',
              'rgb(231, 76, 60)',
              'rgb(155, 89, 182)',
              'rgb(39, 174, 96)',
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  getTotalNumberOfCandidates() {
    this.candidateService
      .getTotalNumberOfRecords()
      .subscribe((response: number) => {
        this.cardData.map((card) => {
          if (card.key === 1) {
            card.count = response;
          }
        });
      });
  }
}
