import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionRegister } from './deduction-register';

describe('DeductionRegister', () => {
  let component: DeductionRegister;
  let fixture: ComponentFixture<DeductionRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
