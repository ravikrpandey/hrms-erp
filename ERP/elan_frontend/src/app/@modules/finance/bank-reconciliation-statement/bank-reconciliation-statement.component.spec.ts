import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReconciliationStatementComponent } from './bank-reconciliation-statement.component';

describe('BankReconciliationStatementComponent', () => {
  let component: BankReconciliationStatementComponent;
  let fixture: ComponentFixture<BankReconciliationStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankReconciliationStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankReconciliationStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
