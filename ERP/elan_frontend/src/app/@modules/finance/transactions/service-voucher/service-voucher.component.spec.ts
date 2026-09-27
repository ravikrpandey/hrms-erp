import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceVoucherComponent } from './service-voucher.component';

describe('ServiceVoucherComponent', () => {
  let component: ServiceVoucherComponent;
  let fixture: ComponentFixture<ServiceVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
