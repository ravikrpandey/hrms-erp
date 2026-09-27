import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCourseDetailComponent } from './assign-course-detail.component';

describe('AssignCourseDetailComponent', () => {
  let component: AssignCourseDetailComponent;
  let fixture: ComponentFixture<AssignCourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCourseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
