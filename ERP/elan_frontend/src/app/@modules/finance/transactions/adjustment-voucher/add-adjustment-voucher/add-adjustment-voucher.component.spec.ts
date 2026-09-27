import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdjustmentVoucherComponent } from './add-adjustment-voucher.component';

describe('AddAdjustmentVoucherComponent', () => {
  let component: AddAdjustmentVoucherComponent;
  let fixture: ComponentFixture<AddAdjustmentVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdjustmentVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdjustmentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
