import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherMasterActionComponent } from './voucher-master-action.component';

describe('VoucherMasterActionComponent', () => {
  let component: VoucherMasterActionComponent;
  let fixture: ComponentFixture<VoucherMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
