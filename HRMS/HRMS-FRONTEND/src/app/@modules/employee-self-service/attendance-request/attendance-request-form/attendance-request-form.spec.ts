import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestForm } from './attendance-request-form';

describe('AttendanceRequestForm', () => {
  let component: AttendanceRequestForm;
  let fixture: ComponentFixture<AttendanceRequestForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRequestForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRequestForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
