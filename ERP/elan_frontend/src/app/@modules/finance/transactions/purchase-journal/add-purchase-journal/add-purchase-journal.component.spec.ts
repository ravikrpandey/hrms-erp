import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseJournalComponent } from './add-purchase-journal.component';

describe('AddPurchaseJournalComponent', () => {
  let component: AddPurchaseJournalComponent;
  let fixture: ComponentFixture<AddPurchaseJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
