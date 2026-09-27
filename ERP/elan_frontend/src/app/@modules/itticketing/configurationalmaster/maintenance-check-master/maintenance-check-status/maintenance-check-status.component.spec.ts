import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCheckStatusComponent } from './maintenance-check-status.component';

describe('MaintenanceCheckStatusComponent', () => {
  let component: MaintenanceCheckStatusComponent;
  let fixture: ComponentFixture<MaintenanceCheckStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCheckStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCheckStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
