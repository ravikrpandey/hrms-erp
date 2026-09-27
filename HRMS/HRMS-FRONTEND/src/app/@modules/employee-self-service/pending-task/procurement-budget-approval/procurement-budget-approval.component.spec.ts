import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementBudgetApprovalComponent } from './procurement-budget-approval.component';

describe('ProcurementBudgetApprovalComponent', () => {
  let component: ProcurementBudgetApprovalComponent;
  let fixture: ComponentFixture<ProcurementBudgetApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementBudgetApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurementBudgetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
