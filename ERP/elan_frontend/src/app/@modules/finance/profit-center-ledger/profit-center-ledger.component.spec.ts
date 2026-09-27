import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCenterLedgerComponent } from './profit-center-ledger.component';

describe('ProfitCenterLedgerComponent', () => {
  let component: ProfitCenterLedgerComponent;
  let fixture: ComponentFixture<ProfitCenterLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitCenterLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitCenterLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
