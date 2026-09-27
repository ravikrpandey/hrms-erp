import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeDialogComponent } from './leave-type-dialog.component';

describe('LeaveTypeDialogComponent', () => {
  let component: LeaveTypeDialogComponent;
  let fixture: ComponentFixture<LeaveTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveTypeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
