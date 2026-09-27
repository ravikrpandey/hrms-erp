import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentVoucherListComponent } from './adjustment-voucher-list.component';

describe('AdjustmentVoucherListComponent', () => {
  let component: AdjustmentVoucherListComponent;
  let fixture: ComponentFixture<AdjustmentVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentVoucherListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
