import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryLedgerListComponent } from './inventory-ledger-list.component';

describe('InventoryLedgerListComponent', () => {
  let component: InventoryLedgerListComponent;
  let fixture: ComponentFixture<InventoryLedgerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryLedgerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryLedgerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
