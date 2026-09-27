import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBookReceiptComponent } from './cash-book-receipt.component';

describe('CashBookReceiptComponent', () => {
  let component: CashBookReceiptComponent;
  let fixture: ComponentFixture<CashBookReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashBookReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashBookReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
