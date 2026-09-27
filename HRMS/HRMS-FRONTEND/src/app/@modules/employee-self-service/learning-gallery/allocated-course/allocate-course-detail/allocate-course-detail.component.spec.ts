import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateCourseDetailComponent } from './allocate-course-detail.component';

describe('AllocateCourseDetailComponent', () => {
  let component: AllocateCourseDetailComponent;
  let fixture: ComponentFixture<AllocateCourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateCourseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
