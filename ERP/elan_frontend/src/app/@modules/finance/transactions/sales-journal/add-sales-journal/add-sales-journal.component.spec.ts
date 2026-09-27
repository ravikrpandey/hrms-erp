import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesJournalComponent } from './add-sales-journal.component';

describe('AddSalesJournalComponent', () => {
  let component: AddSalesJournalComponent;
  let fixture: ComponentFixture<AddSalesJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalesJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalesJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
