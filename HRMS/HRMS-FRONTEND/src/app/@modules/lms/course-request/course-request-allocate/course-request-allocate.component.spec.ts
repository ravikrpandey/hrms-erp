import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRequestAllocateComponent } from './course-request-allocate.component';

describe('CourseRequestAllocateComponent', () => {
  let component: CourseRequestAllocateComponent;
  let fixture: ComponentFixture<CourseRequestAllocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRequestAllocateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRequestAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
