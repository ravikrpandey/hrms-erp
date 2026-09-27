import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorScheduleMaintenanceComponent } from './vendor-schedule-maintenance.component';

describe('VendorScheduleMaintenanceComponent', () => {
  let component: VendorScheduleMaintenanceComponent;
  let fixture: ComponentFixture<VendorScheduleMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorScheduleMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorScheduleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
