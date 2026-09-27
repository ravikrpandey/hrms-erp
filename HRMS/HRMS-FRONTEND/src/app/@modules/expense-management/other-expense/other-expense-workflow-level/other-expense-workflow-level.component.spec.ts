import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherExpenseWorkflowLevelComponent } from './other-expense-workflow-level.component';

describe('OtherExpenseWorkflowLevelComponent', () => {
  let component: OtherExpenseWorkflowLevelComponent;
  let fixture: ComponentFixture<OtherExpenseWorkflowLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherExpenseWorkflowLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherExpenseWorkflowLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
