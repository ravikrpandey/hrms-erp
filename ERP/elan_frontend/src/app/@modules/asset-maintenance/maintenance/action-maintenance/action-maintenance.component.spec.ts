import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMaintenanceComponent } from './action-maintenance.component';

describe('ActionMaintenanceComponent', () => {
  let component: ActionMaintenanceComponent;
  let fixture: ComponentFixture<ActionMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
