import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCreditNoteListComponent } from './sales-credit-note-list.component';

describe('SalesCreditNoteListComponent', () => {
  let component: SalesCreditNoteListComponent;
  let fixture: ComponentFixture<SalesCreditNoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesCreditNoteListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesCreditNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
