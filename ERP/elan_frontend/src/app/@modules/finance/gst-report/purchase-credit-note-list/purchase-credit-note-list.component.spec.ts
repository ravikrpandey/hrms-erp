import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCreditNoteListComponent } from './purchase-credit-note-list.component';

describe('PurchaseCreditNoteListComponent', () => {
  let component: PurchaseCreditNoteListComponent;
  let fixture: ComponentFixture<PurchaseCreditNoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCreditNoteListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCreditNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
