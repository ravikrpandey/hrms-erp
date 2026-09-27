import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplyActionComponent } from './leave-apply-action.component';

describe('LeaveApplyActionComponent', () => {
  let component: LeaveApplyActionComponent;
  let fixture: ComponentFixture<LeaveApplyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveApplyActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
