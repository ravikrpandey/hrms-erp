import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalStatusReportComponent } from './approval-status-report.component';

describe('ApprovalStatusReportComponent', () => {
  let component: ApprovalStatusReportComponent;
  let fixture: ComponentFixture<ApprovalStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
