import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCourseActionComponent } from './common-course-action.component';

describe('CommonCourseActionComponent', () => {
  let component: CommonCourseActionComponent;
  let fixture: ComponentFixture<CommonCourseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCourseActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonCourseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
