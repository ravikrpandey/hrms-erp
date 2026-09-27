import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipRejectComponent } from './pay-slip-reject.component';

describe('PaySlipRejectComponent', () => {
  let component: PaySlipRejectComponent;
  let fixture: ComponentFixture<PaySlipRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySlipRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySlipRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
