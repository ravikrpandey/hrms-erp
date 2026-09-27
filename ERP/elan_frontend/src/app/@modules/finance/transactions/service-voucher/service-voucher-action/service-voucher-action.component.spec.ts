import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceVoucherActionComponent } from './service-voucher-action.component';

describe('ServiceVoucherActionComponent', () => {
  let component: ServiceVoucherActionComponent;
  let fixture: ComponentFixture<ServiceVoucherActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceVoucherActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceVoucherActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
