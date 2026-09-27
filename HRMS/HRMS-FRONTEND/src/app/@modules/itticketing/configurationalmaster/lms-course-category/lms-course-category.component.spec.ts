import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsCourseCategoryComponent } from './lms-course-category.component';

describe('LmsCourseCategoryComponent', () => {
  let component: LmsCourseCategoryComponent;
  let fixture: ComponentFixture<LmsCourseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsCourseCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
