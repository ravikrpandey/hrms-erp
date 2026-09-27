import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentVoucherActionComponent } from './adjustment-voucher-action.component';

describe('AdjustmentVoucherActionComponent', () => {
  let component: AdjustmentVoucherActionComponent;
  let fixture: ComponentFixture<AdjustmentVoucherActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentVoucherActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentVoucherActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
