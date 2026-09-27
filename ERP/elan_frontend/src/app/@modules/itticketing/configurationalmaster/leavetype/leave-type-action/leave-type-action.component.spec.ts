import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeActionComponent } from './leave-type-action.component';

describe('LeaveTypeActionComponent', () => {
  let component: LeaveTypeActionComponent;
  let fixture: ComponentFixture<LeaveTypeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveTypeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveTypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
