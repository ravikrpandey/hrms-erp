import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMangmentComponent } from './ticket-mangment.component';

describe('TicketMangmentComponent', () => {
  let component: TicketMangmentComponent;
  let fixture: ComponentFixture<TicketMangmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketMangmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketMangmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
