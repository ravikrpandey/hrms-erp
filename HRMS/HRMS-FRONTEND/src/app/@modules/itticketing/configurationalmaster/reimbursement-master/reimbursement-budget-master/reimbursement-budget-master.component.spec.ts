import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementBudgetMasterComponent } from './reimbursement-budget-master.component';

describe('ReimbursementBudgetMasterComponent', () => {
  let component: ReimbursementBudgetMasterComponent;
  let fixture: ComponentFixture<ReimbursementBudgetMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementBudgetMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementBudgetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
