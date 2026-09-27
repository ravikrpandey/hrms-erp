import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCourseActionComponent } from './assign-course-action.component';

describe('AssignCourseActionComponent', () => {
  let component: AssignCourseActionComponent;
  let fixture: ComponentFixture<AssignCourseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCourseActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCourseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
