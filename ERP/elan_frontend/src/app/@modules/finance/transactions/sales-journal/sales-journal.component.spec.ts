import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesJournalComponent } from './sales-journal.component';

describe('SalesJournalComponent', () => {
  let component: SalesJournalComponent;
  let fixture: ComponentFixture<SalesJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
