import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDebitNoteListComponent } from './sales-debit-note-list.component';

describe('SalesDebitNoteListComponent', () => {
  let component: SalesDebitNoteListComponent;
  let fixture: ComponentFixture<SalesDebitNoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDebitNoteListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDebitNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
