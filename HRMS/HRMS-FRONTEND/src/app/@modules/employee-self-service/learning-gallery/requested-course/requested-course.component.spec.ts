import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedCourseComponent } from './requested-course.component';

describe('RequestedCourseComponent', () => {
  let component: RequestedCourseComponent;
  let fixture: ComponentFixture<RequestedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
