import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementExpenseComponent } from './reimbursement-expense.component';

describe('ReimbursementExpenseComponent', () => {
  let component: ReimbursementExpenseComponent;
  let fixture: ComponentFixture<ReimbursementExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
