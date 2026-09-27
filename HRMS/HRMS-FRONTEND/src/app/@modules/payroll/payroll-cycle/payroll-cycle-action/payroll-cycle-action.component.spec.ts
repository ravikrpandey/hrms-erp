import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCycleActionComponent } from './payroll-cycle-action.component';

describe('PayrollCycleActionComponent', () => {
  let component: PayrollCycleActionComponent;
  let fixture: ComponentFixture<PayrollCycleActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCycleActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollCycleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
