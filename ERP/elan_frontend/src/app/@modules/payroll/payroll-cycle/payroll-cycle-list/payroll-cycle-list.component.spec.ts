import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCycleListComponent } from './payroll-cycle-list.component';

describe('PayrollCycleListComponent', () => {
  let component: PayrollCycleListComponent;
  let fixture: ComponentFixture<PayrollCycleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollCycleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollCycleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
