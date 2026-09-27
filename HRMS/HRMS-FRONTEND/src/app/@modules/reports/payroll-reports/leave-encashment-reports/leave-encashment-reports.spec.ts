import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEncashmentReports } from './leave-encashment-reports';

describe('LeaveEncashmentReports', () => {
  let component: LeaveEncashmentReports;
  let fixture: ComponentFixture<LeaveEncashmentReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveEncashmentReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveEncashmentReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
