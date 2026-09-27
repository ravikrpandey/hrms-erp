import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRegister } from './pay-register';

describe('PayRegister', () => {
  let component: PayRegister;
  let fixture: ComponentFixture<PayRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
