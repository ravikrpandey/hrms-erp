import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCycleCreateComponent } from './payroll-cycle-create.component';

describe('PayrollCycleCreateComponent', () => {
  let component: PayrollCycleCreateComponent;
  let fixture: ComponentFixture<PayrollCycleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCycleCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollCycleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
