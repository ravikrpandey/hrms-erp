import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStatusListComponent } from './varification-list.component';

describe('InterviewStatusListComponent', () => {
  let component: InterviewStatusListComponent;
  let fixture: ComponentFixture<InterviewStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewStatusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
