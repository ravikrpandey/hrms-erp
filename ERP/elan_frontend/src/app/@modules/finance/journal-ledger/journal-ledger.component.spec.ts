import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalLedgerComponent } from './journal-ledger.component';

describe('JournalLedgerComponent', () => {
  let component: JournalLedgerComponent;
  let fixture: ComponentFixture<JournalLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
