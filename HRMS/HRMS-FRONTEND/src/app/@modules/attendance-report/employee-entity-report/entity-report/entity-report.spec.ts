import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListReport } from './entity-report';

describe('EmployeeListReport', () => {
  let component: EmployeeListReport;
  let fixture: ComponentFixture<EmployeeListReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeListReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeListReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
