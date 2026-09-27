import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestList } from './attendance-request-list';

describe('AttendanceRequestList', () => {
  let component: AttendanceRequestList;
  let fixture: ComponentFixture<AttendanceRequestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRequestList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRequestList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
