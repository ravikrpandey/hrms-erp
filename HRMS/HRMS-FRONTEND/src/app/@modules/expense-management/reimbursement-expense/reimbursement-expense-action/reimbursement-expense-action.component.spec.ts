import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementExpenseActionComponent } from './reimbursement-expense-action.component';

describe('ReimbursementExpenseActionComponent', () => {
  let component: ReimbursementExpenseActionComponent;
  let fixture: ComponentFixture<ReimbursementExpenseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementExpenseActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementExpenseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
