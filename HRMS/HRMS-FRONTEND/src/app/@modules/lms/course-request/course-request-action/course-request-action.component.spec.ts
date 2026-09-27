import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRequestActionComponent } from './course-request-action.component';

describe('CourseRequestActionComponent', () => {
  let component: CourseRequestActionComponent;
  let fixture: ComponentFixture<CourseRequestActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRequestActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
