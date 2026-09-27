import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportVoucherListComponent } from './transport-voucher-list.component';

describe('TransportVoucherListComponent', () => {
  let component: TransportVoucherListComponent;
  let fixture: ComponentFixture<TransportVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportVoucherListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
