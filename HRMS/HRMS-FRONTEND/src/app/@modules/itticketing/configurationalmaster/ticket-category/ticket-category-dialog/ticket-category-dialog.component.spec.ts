import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCategoryDialogComponent } from './ticket-category-dialog.component';

describe('TicketCategoryDialogComponent', () => {
  let component: TicketCategoryDialogComponent;
  let fixture: ComponentFixture<TicketCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketCategoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
