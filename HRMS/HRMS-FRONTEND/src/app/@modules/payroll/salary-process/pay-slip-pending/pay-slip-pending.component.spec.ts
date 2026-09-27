import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipPendingComponent } from './pay-slip-pending.component';

describe('PaySlipPendingComponent', () => {
  let component: PaySlipPendingComponent;
  let fixture: ComponentFixture<PaySlipPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySlipPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySlipPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
