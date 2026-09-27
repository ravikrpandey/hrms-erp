import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTransactionListComponent } from './financial-transaction-list.component';

describe('FinancialTransactionListComponent', () => {
  let component: FinancialTransactionListComponent;
  let fixture: ComponentFixture<FinancialTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialTransactionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
