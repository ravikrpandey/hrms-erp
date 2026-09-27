import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedLeaveActionComponent } from './applied-leave-action.component';

describe('AppliedLeaveActionComponent', () => {
  let component: AppliedLeaveActionComponent;
  let fixture: ComponentFixture<AppliedLeaveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedLeaveActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedLeaveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
