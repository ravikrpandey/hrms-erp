import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinancialTransactionsIntegrationsComponent } from './add-financial-transactions-integrations.component';

describe('AddFinancialTransactionsIntegrationsComponent', () => {
  let component: AddFinancialTransactionsIntegrationsComponent;
  let fixture: ComponentFixture<AddFinancialTransactionsIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinancialTransactionsIntegrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinancialTransactionsIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
