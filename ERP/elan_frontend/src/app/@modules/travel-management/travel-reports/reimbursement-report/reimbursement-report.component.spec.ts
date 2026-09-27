import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementReportComponent } from './reimbursement-report.component';

describe('ReimbursementReportComponent', () => {
  let component: ReimbursementReportComponent;
  let fixture: ComponentFixture<ReimbursementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
