import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherMasterComponent } from './add-voucher-master.component';

describe('AddVoucherMasterComponent', () => {
  let component: AddVoucherMasterComponent;
  let fixture: ComponentFixture<AddVoucherMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVoucherMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVoucherMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
