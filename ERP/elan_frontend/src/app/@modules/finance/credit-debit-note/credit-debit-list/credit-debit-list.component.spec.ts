import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitListComponent } from './credit-debit-list.component';

describe('CreditDebitListComponent', () => {
  let component: CreditDebitListComponent;
  let fixture: ComponentFixture<CreditDebitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditDebitListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditDebitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
