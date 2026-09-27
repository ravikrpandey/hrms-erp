import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistApprovalListComponent } from './checklist-approval-list.component';

describe('ChecklistApprovalListComponent', () => {
  let component: ChecklistApprovalListComponent;
  let fixture: ComponentFixture<ChecklistApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistApprovalListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
