import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRestrictionsComponent } from './leave-restrictions.component';

describe('LeaveRestrictionsComponent', () => {
  let component: LeaveRestrictionsComponent;
  let fixture: ComponentFixture<LeaveRestrictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRestrictionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
