import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stat-cards',
  templateUrl: './stat-cards.component.html',
  styleUrls: ['./stat-cards.component.css'],
})
export class StatCardsComponent {
  @Input() data: { key: number; title: string; count: number };

  role: boolean;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {}

  openComponent() {
    if (this.data.key === 1)
      this.router.navigateByUrl('/candidate-pool/all-candidates/search');
    else if (this.data.key === 2) this.router.navigateByUrl('/interview/jobs');
    else if (this.data.key === 3)
      this.router.navigateByUrl(`dashboard/${this.data.key}/search`);
    else if (this.data.key === 4)
      this.router.navigateByUrl(`dashboard/${this.data.key}/search`);
    else if (this.data.key === 5)
      this.router.navigateByUrl(`dashboard/${this.data.key}/search`);
    else if (this.data.key === 6)
      this.router.navigateByUrl(`dashboard/${this.data.key}/search`);
    else if (this.data.key == 7)
      this.router.navigateByUrl(`dashboard/${this.data.key}/search`);
    else this.router.navigateByUrl('/dashboard');
  }
}
