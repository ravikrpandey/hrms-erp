import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocDeductionReports } from './adhoc-deduction-reports';

describe('AdhocDeductionReports', () => {
  let component: AdhocDeductionReports;
  let fixture: ComponentFixture<AdhocDeductionReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdhocDeductionReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdhocDeductionReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
