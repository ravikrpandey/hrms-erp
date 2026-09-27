import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditDebitNoteComponent } from './add-credit-debit-note.component';

describe('AddCreditDebitNoteComponent', () => {
  let component: AddCreditDebitNoteComponent;
  let fixture: ComponentFixture<AddCreditDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCreditDebitNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCreditDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
