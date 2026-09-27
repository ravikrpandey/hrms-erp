import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseApprovalActionComponent } from './course-approval-action.component';

describe('CourseApprovalActionComponent', () => {
  let component: CourseApprovalActionComponent;
  let fixture: ComponentFixture<CourseApprovalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseApprovalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
