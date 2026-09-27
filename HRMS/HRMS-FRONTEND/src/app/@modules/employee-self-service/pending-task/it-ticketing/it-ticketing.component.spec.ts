import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItTicketingComponent } from './it-ticketing.component';

describe('ItTicketingComponent', () => {
  let component: ItTicketingComponent;
  let fixture: ComponentFixture<ItTicketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItTicketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItTicketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
