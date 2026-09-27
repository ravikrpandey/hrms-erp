import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseJournalActionsComponent } from './purchase-journal-actions.component';

describe('PurchaseJournalActionsComponent', () => {
  let component: PurchaseJournalActionsComponent;
  let fixture: ComponentFixture<PurchaseJournalActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseJournalActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseJournalActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
