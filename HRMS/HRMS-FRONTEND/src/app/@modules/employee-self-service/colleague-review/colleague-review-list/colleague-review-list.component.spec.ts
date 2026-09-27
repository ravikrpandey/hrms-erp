import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueReviewListComponent } from './colleague-review-list.component';

describe('ColleagueReviewListComponent', () => {
  let component: ColleagueReviewListComponent;
  let fixture: ComponentFixture<ColleagueReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleagueReviewListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColleagueReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
