import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicabilityComponent } from './leave-applicability.component';

describe('LeaveApplicabilityComponent', () => {
  let component: LeaveApplicabilityComponent;
  let fixture: ComponentFixture<LeaveApplicabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveApplicabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
