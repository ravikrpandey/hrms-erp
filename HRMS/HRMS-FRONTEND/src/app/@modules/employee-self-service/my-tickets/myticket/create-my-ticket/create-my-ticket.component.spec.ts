import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMyTicketComponent } from './create-my-ticket.component';

describe('CreateMyTicketComponent', () => {
  let component: CreateMyTicketComponent;
  let fixture: ComponentFixture<CreateMyTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMyTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
