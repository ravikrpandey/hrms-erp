import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewlistCreateComponent } from './interviewlist-create.component';

describe('InterviewlistCreateComponent', () => {
  let component: InterviewlistCreateComponent;
  let fixture: ComponentFixture<InterviewlistCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewlistCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewlistCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
