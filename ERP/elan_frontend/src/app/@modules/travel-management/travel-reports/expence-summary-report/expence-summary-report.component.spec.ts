import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceSummaryReportComponent } from './expence-summary-report.component';

describe('ExpenceSummaryReportComponent', () => {
  let component: ExpenceSummaryReportComponent;
  let fixture: ComponentFixture<ExpenceSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenceSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenceSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
