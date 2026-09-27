import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAllocatedTicketComponent } from './create-allocated-ticket.component';

describe('CreateAllocatedTicketComponent', () => {
  let component: CreateAllocatedTicketComponent;
  let fixture: ComponentFixture<CreateAllocatedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAllocatedTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAllocatedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
