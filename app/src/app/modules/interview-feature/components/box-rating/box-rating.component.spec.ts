import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxRatingComponent } from './box-rating.component';
import { EventEmitter } from '@angular/core';

describe('BoxRatingComponent', () => {
  let component: BoxRatingComponent;
  let fixture: ComponentFixture<BoxRatingComponent>;
  let onChangeMock: jasmine.Spy;
  let onTouchedMock: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxRatingComponent);
    component = fixture.componentInstance;
    onChangeMock = jasmine.createSpy('onChange');
    onTouchedMock = jasmine.createSpy('onTouched');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setRating', () => {
    it('should set the current rating to the specified value', () => {
      const rating = 4;
      component.onChange = onChangeMock;
      component.onTouched = onTouchedMock;

      component.setRating(rating);

      expect(component.currentRating).toEqual(rating);
    });

    it('should invoke the onChange callback with the specified rating', () => {
      const rating = 4;
      component.onChange = onChangeMock;
      component.onTouched = onTouchedMock;

      component.setRating(rating);

      expect(onChangeMock).toHaveBeenCalledWith(rating);
    });

    it('should invoke the onTouched callback', () => {
      const rating = 4;
      component.onChange = onChangeMock;
      component.onTouched = onTouchedMock;

      component.setRating(rating);

      expect(onTouchedMock).toHaveBeenCalled();
    });

    it('should emit the ratingChanged event with the specified rating', () => {
      const rating = 4;
      component.onChange = onChangeMock;
      component.onTouched = onTouchedMock;
      component.ratingChanged = new EventEmitter<number>();

      spyOn(component.ratingChanged, 'emit');

      component.setRating(rating);

      expect(component.ratingChanged.emit).toHaveBeenCalledWith(rating);
    });
  });

  describe('setHoverRating', () => {
    it('should set the hover rating to the specified value if no current rating exists', () => {
      const rating = 3;
      component.rating = 0;

      component.setHoverRating(rating);

      expect(component.hoverRating).toEqual(rating);
    });

    it('should not change the hover rating if a current rating exists', () => {
      const rating = 3;
      component.rating = 4;
      component.hoverRating = 2;

      component.setHoverRating(rating);

      expect(component.hoverRating).toEqual(2);
    });
  });

  describe('clearHoverRating', () => {
    it('should clear the hover rating if no current rating exists', () => {
      component.rating = 0;
      component.hoverRating = 3;

      component.clearHoverRating();

      expect(component.hoverRating).toBeNull();
    });

    it('should not clear the hover rating if a current rating exists', () => {
      component.rating = 4;
      component.hoverRating = 3;

      component.clearHoverRating();

      expect(component.hoverRating).toEqual(3);
    });
  });

  describe('writeValue', () => {
    it('should set the current rating to the specified value if it is truthy', () => {
      const rating = 3;

      component.writeValue(rating);

      expect(component.currentRating).toEqual(rating);
    });

    it('should not change the current rating if the specified value is falsy', () => {
      const rating = 0;
      component.currentRating = 4;

      component.writeValue(rating);

      expect(component.currentRating).toEqual(4);
    });
  });

  describe('registerOnChange', () => {
    it('should set the onChange callback to the specified function', () => {
      const onChangeFn = () => {};

      component.registerOnChange(onChangeFn);

      expect(component.onChange).toEqual(onChangeFn);
    });
  });

  describe('registerOnTouched', () => {
    it('should set the onTouched callback to the specified function', () => {
      const onTouchedFn = () => {};

      component.registerOnTouched(onTouchedFn);

      expect(component.onTouched).toEqual(onTouchedFn);
    });
  });
});
