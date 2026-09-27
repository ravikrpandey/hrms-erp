import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceVoucherComponent } from './add-service-voucher.component';

describe('AddServiceVoucherComponent', () => {
  let component: AddServiceVoucherComponent;
  let fixture: ComponentFixture<AddServiceVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
