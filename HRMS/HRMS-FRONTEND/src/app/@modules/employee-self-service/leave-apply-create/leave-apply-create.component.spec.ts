import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplyCreateComponent } from './leave-apply-create.component';

describe('LeaveApplyCreateComponent', () => {
  let component: LeaveApplyCreateComponent;
  let fixture: ComponentFixture<LeaveApplyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveApplyCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
