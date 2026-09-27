import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCourseDialogComponent } from './common-course-dialog.component';

describe('CommonCourseDialogComponent', () => {
  let component: CommonCourseDialogComponent;
  let fixture: ComponentFixture<CommonCourseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCourseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
