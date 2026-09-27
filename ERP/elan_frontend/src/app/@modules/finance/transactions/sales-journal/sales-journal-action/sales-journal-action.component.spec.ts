import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesJournalActionComponent } from './sales-journal-action.component';

describe('SalesJournalActionComponent', () => {
  let component: SalesJournalActionComponent;
  let fixture: ComponentFixture<SalesJournalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesJournalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesJournalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
