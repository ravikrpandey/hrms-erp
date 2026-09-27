import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCourseDetaileComponent } from './common-course-detaile.component';

describe('CommonCourseDetaileComponent', () => {
  let component: CommonCourseDetaileComponent;
  let fixture: ComponentFixture<CommonCourseDetaileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCourseDetaileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonCourseDetaileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
