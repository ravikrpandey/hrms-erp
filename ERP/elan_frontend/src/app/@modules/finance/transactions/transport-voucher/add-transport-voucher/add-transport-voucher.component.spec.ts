import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransportVoucherComponent } from './add-transport-voucher.component';

describe('AddTransportVoucherComponent', () => {
  let component: AddTransportVoucherComponent;
  let fixture: ComponentFixture<AddTransportVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransportVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransportVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
