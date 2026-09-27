import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRegister } from './leave-register';

describe('LeaveRegister', () => {
  let component: LeaveRegister;
  let fixture: ComponentFixture<LeaveRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
