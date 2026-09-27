import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMaintenanceComponent } from './approve-maintenance.component';

describe('ApproveMaintenanceComponent', () => {
  let component: ApproveMaintenanceComponent;
  let fixture: ComponentFixture<ApproveMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
