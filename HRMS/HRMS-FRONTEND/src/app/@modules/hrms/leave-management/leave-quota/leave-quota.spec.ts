import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveQuota } from './leave-quota';

describe('LeaveQuota', () => {
  let component: LeaveQuota;
  let fixture: ComponentFixture<LeaveQuota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveQuota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveQuota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
