import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionColleagueReview } from './action.component';

describe('ActionComponent', () => {
  let component: ActionColleagueReview;
  let fixture: ComponentFixture<ActionColleagueReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionColleagueReview ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionColleagueReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
