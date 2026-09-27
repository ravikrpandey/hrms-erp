import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRequestComponent } from './course-request.component';

describe('CourseRequestComponent', () => {
  let component: CourseRequestComponent;
  let fixture: ComponentFixture<CourseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
