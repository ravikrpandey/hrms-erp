import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipActionComponent } from './salary-slip-action.component';

describe('SalarySlipActionComponent', () => {
  let component: SalarySlipActionComponent;
  let fixture: ComponentFixture<SalarySlipActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySlipActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
