import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitNoteActionComponent } from './credit-debit-note-action.component';

describe('CreditDebitNoteActionComponent', () => {
  let component: CreditDebitNoteActionComponent;
  let fixture: ComponentFixture<CreditDebitNoteActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditDebitNoteActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditDebitNoteActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
