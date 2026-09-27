import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProposalVersionComponent } from './schedule-proposal-version.component';

describe('ScheduleProposalVersionComponent', () => {
  let component: ScheduleProposalVersionComponent;
  let fixture: ComponentFixture<ScheduleProposalVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleProposalVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleProposalVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
