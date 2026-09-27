import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCheckListComponent } from './maintenance-check-list.component';

describe('MaintenanceCheckListComponent', () => {
  let component: MaintenanceCheckListComponent;
  let fixture: ComponentFixture<MaintenanceCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCheckListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
