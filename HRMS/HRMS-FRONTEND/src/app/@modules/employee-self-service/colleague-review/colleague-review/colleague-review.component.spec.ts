import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueReviewComponent } from './colleague-review.component';

describe('ColleagueReviewComponent', () => {
  let component: ColleagueReviewComponent;
  let fixture: ComponentFixture<ColleagueReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleagueReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColleagueReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
