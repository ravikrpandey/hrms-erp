import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceApproval } from './attendance-approval';

describe('AttendanceApproval', () => {
  let component: AttendanceApproval;
  let fixture: ComponentFixture<AttendanceApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
