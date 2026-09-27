import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseApprovalDialogComponent } from './course-approval-dialog.component';

describe('CourseApprovalDialogComponent', () => {
  let component: CourseApprovalDialogComponent;
  let fixture: ComponentFixture<CourseApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
