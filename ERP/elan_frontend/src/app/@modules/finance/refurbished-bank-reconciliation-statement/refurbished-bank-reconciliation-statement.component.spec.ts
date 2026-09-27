import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefurbishedBankStatementComponent } from './refurbished-bank-reconciliation-statement.component';

describe('RefurbishedBankStatementComponent', () => {
  let component: RefurbishedBankStatementComponent;
  let fixture: ComponentFixture<RefurbishedBankStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefurbishedBankStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefurbishedBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
