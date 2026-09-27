import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTransportVoucherComponent } from './download-transport-voucher.component';

describe('DownloadTransportVoucherComponent', () => {
  let component: DownloadTransportVoucherComponent;
  let fixture: ComponentFixture<DownloadTransportVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTransportVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTransportVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
