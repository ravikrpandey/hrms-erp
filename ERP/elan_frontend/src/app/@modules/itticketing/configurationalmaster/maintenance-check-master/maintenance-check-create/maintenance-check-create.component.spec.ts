import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCheckCreateComponent } from './maintenance-check-create.component';

describe('MaintenanceCheckCreateComponent', () => {
  let component: MaintenanceCheckCreateComponent;
  let fixture: ComponentFixture<MaintenanceCheckCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCheckCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCheckCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
