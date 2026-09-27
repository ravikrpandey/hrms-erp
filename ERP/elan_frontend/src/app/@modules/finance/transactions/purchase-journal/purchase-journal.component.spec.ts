import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseJournalComponent } from './purchase-journal.component';

describe('PurchaseJournalComponent', () => {
  let component: PurchaseJournalComponent;
  let fixture: ComponentFixture<PurchaseJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
