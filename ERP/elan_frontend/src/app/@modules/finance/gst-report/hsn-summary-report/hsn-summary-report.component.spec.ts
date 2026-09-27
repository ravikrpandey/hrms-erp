import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnSummaryReportComponent } from './hsn-summary-report.component';

describe('HsnSummaryReportComponent', () => {
  let component: HsnSummaryReportComponent;
  let fixture: ComponentFixture<HsnSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsnSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
