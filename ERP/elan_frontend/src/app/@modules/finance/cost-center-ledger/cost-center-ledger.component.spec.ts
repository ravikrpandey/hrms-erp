import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterLedgerComponent } from './cost-center-ledger.component';

describe('CostCenterLedgerComponent', () => {
  let component: CostCenterLedgerComponent;
  let fixture: ComponentFixture<CostCenterLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
