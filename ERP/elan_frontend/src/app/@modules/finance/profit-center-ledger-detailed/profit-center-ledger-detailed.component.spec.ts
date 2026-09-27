import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCenterLedgerDetailedComponent } from './profit-center-ledger-detailed.component';

describe('ProfitCenterLedgerDetailedComponent', () => {
  let component: ProfitCenterLedgerDetailedComponent;
  let fixture: ComponentFixture<ProfitCenterLedgerDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitCenterLedgerDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitCenterLedgerDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
