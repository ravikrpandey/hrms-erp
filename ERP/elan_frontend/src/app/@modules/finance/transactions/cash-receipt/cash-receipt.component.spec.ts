import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptComponent } from './cash-receipt.component';

describe('CashReceiptComponent', () => {
  let component: CashReceiptComponent;
  let fixture: ComponentFixture<CashReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
