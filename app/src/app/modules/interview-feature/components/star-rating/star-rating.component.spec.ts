import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setRating', () => {
    it('should set the rating and trigger onChange, onTouched, and ratingChanged.emit', () => {
      // Arrange
      const rating = 3;
      spyOn(component, 'onChange');
      spyOn(component, 'onTouched');
      spyOn(component.ratingChanged, 'emit');

      // Act
      component.setRating(rating);

      // Assert
      expect(component.currentRating).toBe(rating);
      expect(component.onChange).toHaveBeenCalledWith(rating);
      expect(component.onTouched).toHaveBeenCalled();
      expect(component.ratingChanged.emit).toHaveBeenCalledWith(rating);
    });
  });

  describe('hoverRating', () => {
    it('should set the hoverRating if rating is not set', () => {
      // Arrange
      const rating = 4;
      component.rating = 0;

      // Act
      component.setHoverRating(rating);

      // Assert
      expect(component.hoverRating).toBe(rating);
    });

    it('should not set the hoverRating if rating is set', () => {
      // Arrange
      const rating = 4;
      component.rating = 3;

      // Act
      component.setHoverRating(rating);

      // Assert
      expect(component.hoverRating).toBeUndefined();
    });
  });

  describe('clearHoverRating', () => {
    it('should clear the hoverRating if rating is not set', () => {
      // Arrange
      component.rating = 0;
      component.hoverRating = 4;

      // Act
      component.clearHoverRating();

      // Assert
      expect(component.hoverRating).toBeNull();
    });

    it('should not clear the hoverRating if rating is set', () => {
      // Arrange
      component.rating = 3;
      component.hoverRating = 4;

      // Act
      component.clearHoverRating();

      // Assert
      expect(component.hoverRating).toBe(4);
    });
  });

  describe('writeValue', () => {
    it('should set the currentRating if a valid rating is provided', () => {
      // Arrange
      const rating = 3;

      // Act
      component.writeValue(rating);

      // Assert
      expect(component.currentRating).toBe(rating);
    });

    it('should not set the currentRating if rating is not provided', () => {
      // Arrange
      component.currentRating = 3;

      // Act
      component.writeValue(0);

      // Assert
      expect(component.currentRating).toBe(3);
    });
  });

  describe('registerOnChange', () => {
    it('should register the onChange function', () => {
      // Arrange
      const fn = () => {};

      // Act
      component.registerOnChange(fn);

      // Assert
      expect(component.onChange).toBe(fn);
    });
  });

  describe('registerOnTouched', () => {
    it('should register the onTouched function', () => {
      // Arrange
      const fn = () => {};

      // Act
      component.registerOnTouched(fn);

      // Assert
      expect(component.onTouched).toBe(fn);
    });
  });
});
