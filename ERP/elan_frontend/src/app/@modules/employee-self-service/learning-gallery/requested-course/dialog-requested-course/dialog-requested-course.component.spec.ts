import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestedCourseComponent } from './dialog-requested-course.component';

describe('DialogRequestedCourseComponent', () => {
  let component: DialogRequestedCourseComponent;
  let fixture: ComponentFixture<DialogRequestedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRequestedCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
