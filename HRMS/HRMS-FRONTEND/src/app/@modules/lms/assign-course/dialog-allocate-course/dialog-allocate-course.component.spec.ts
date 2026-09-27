import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAllocateCourseComponent } from './dialog-allocate-course.component';

describe('DialogAllocateCourseComponent', () => {
  let component: DialogAllocateCourseComponent;
  let fixture: ComponentFixture<DialogAllocateCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAllocateCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAllocateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
