import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMaintenanceComponent } from './plan-maintenance.component';

describe('PlanMaintenanceComponent', () => {
  let component: PlanMaintenanceComponent;
  let fixture: ComponentFixture<PlanMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
