import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceComponent } from './add-maintenance.component';

describe('AddMaintenanceComponent', () => {
  let component: AddMaintenanceComponent;
  let fixture: ComponentFixture<AddMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
