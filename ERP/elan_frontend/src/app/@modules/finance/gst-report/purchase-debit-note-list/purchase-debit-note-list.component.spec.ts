import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDebitNoteListComponent } from './purchase-debit-note-list.component';

describe('PurchaseDebitNoteListComponent', () => {
  let component: PurchaseDebitNoteListComponent;
  let fixture: ComponentFixture<PurchaseDebitNoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseDebitNoteListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDebitNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
