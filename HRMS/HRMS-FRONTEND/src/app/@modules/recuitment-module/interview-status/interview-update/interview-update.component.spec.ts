import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewUpdateComponent } from './interview-update.component';

describe('InterviewUpdateComponent', () => {
  let component: InterviewUpdateComponent;
  let fixture: ComponentFixture<InterviewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
