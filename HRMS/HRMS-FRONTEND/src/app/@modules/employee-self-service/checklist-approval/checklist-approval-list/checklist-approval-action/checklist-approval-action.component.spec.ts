import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistApprovalActionComponent } from './checklist-approval-action.component';

describe('ChecklistApprovalActionComponent', () => {
  let component: ChecklistApprovalActionComponent;
  let fixture: ComponentFixture<ChecklistApprovalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistApprovalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
