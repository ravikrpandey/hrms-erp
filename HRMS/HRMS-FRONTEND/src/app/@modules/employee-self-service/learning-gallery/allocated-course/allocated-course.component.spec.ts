import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedCourseComponent } from './allocated-course.component';

describe('AllocatedCourseComponent', () => {
  let component: AllocatedCourseComponent;
  let fixture: ComponentFixture<AllocatedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
