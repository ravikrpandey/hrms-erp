import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTravelReportComponent } from './employee-travel-report.component';

describe('EmployeeTravelReportComponent', () => {
  let component: EmployeeTravelReportComponent;
  let fixture: ComponentFixture<EmployeeTravelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTravelReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTravelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
