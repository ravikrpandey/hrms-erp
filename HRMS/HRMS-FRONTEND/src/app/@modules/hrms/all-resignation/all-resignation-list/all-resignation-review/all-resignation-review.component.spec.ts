import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationReviewComponent } from './all-resignation-review.component';

describe('AllResignationReviewComponent', () => {
  let component: AllResignationReviewComponent;
  let fixture: ComponentFixture<AllResignationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
