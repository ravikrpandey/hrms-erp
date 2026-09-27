import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedTicketsComponent } from './allocated-tickets.component';

describe('AllocatedTicketsComponent', () => {
  let component: AllocatedTicketsComponent;
  let fixture: ComponentFixture<AllocatedTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
