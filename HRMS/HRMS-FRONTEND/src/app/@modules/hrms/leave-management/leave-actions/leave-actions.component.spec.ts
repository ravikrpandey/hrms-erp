import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveActionsComponent } from './leave-actions.component';

describe('LeaveActionsComponent', () => {
  let component: LeaveActionsComponent;
  let fixture: ComponentFixture<LeaveActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
