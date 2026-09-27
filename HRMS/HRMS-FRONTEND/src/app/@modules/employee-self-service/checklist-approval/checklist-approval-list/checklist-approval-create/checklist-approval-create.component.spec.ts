import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistApprovalCreateComponent } from './checklist-approval-create.component';

describe('ChecklistApprovalCreateComponent', () => {
  let component: ChecklistApprovalCreateComponent;
  let fixture: ComponentFixture<ChecklistApprovalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistApprovalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistApprovalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
