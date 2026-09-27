import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherActionComponent } from './voucher-action.component';

describe('VoucherActionComponent', () => {
  let component: VoucherActionComponent;
  let fixture: ComponentFixture<VoucherActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
