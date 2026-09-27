import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReimbursementBudgetComponent } from './create-reimbursement-budget.component';

describe('CreateReimbursementBudgetComponent', () => {
  let component: CreateReimbursementBudgetComponent;
  let fixture: ComponentFixture<CreateReimbursementBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReimbursementBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReimbursementBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
