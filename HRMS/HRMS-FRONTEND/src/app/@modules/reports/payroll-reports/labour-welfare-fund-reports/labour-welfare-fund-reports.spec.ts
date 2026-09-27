import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourWelfareReport } from './labour-welfare-fund-reports';

describe('EmployeeExpenses', () => {
  let component: LabourWelfareReport;
  let fixture: ComponentFixture<LabourWelfareReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabourWelfareReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabourWelfareReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
