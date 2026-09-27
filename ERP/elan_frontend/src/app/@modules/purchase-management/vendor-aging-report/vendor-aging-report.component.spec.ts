import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAgingReportComponent } from './vendor-aging-report.component';

describe('VendorAgingReportComponent', () => {
  let component: VendorAgingReportComponent;
  let fixture: ComponentFixture<VendorAgingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAgingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
