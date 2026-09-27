import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOrderAppListDialogComponent } from './task-order-app-list-dialog.component';

describe('TaskOrderAppListDialogComponent', () => {
  let component: TaskOrderAppListDialogComponent;
  let fixture: ComponentFixture<TaskOrderAppListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskOrderAppListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOrderAppListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
