import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-box-rating',
  templateUrl: './box-rating.component.html',
  styleUrls: ['./box-rating.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BoxRatingComponent,
      multi: true,
    },
  ],
})
export class BoxRatingComponent {
  @Input() maxRating: number = 10;
  @Input() rating: number;
  @Input() reset: boolean;
  @Input() disableColorChange: boolean;
  @Output() ratingChanged: EventEmitter<number> = new EventEmitter<number>();

  currentRating: number | null;
  hoverRating: number | null;
  ratings: number[];

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.ratings = Array(this.maxRating)
      .fill(0)
      .map((x, i) => i + 1);
  }

  ngOnInit() {
    this.setRating(this.rating);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reset && changes.reset.currentValue) {
      this.currentRating = null;
      this.hoverRating = null;
    }
  }

  setRating(rating: number): void {
    this.currentRating = rating;
    this.onChange(rating);
    this.onTouched();
    this.ratingChanged.emit(rating);
  }

  setHoverRating(rating: number): void {
    if (!this.rating) {
      this.hoverRating = rating;
    }
  }

  clearHoverRating(): void {
    if (!this.rating) {
      this.hoverRating = null;
    }
  }

  writeValue(rating: number): void {
    if (rating) {
      this.currentRating = rating;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
