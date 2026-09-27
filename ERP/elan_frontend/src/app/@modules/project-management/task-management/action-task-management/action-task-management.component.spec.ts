import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTaskManagementComponent } from './action-task-management.component';

describe('ActionTaskManagementComponent', () => {
  let component: ActionTaskManagementComponent;
  let fixture: ComponentFixture<ActionTaskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTaskManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
