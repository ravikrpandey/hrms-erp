import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCheckActionComponent } from './maintenance-check-action.component';

describe('MaintenanceCheckActionComponent', () => {
  let component: MaintenanceCheckActionComponent;
  let fixture: ComponentFixture<MaintenanceCheckActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCheckActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCheckActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
