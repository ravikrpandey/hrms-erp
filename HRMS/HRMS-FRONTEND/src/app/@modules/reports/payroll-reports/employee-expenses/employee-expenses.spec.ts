import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExpenses } from './employee-expenses';

describe('EmployeeExpenses', () => {
  let component: EmployeeExpenses;
  let fixture: ComponentFixture<EmployeeExpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeExpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeExpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
