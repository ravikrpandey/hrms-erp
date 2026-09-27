import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistApprovalComponent } from './checklist-approval.component';

describe('ChecklistApprovalComponent', () => {
  let component: ChecklistApprovalComponent;
  let fixture: ComponentFixture<ChecklistApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
