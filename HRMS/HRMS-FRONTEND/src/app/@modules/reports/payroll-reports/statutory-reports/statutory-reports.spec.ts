import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryReports } from './statutory-reports';

describe('EmployeeExpenses', () => {
  let component: StatutoryReports;
  let fixture: ComponentFixture<StatutoryReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatutoryReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatutoryReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
