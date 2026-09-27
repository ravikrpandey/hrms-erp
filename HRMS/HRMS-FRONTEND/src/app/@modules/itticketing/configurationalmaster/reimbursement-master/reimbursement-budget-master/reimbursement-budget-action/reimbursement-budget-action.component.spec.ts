import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementBudgetActionComponent } from './reimbursement-budget-action.component';

describe('ReimbursementBudgetActionComponent', () => {
  let component: ReimbursementBudgetActionComponent;
  let fixture: ComponentFixture<ReimbursementBudgetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementBudgetActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementBudgetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
