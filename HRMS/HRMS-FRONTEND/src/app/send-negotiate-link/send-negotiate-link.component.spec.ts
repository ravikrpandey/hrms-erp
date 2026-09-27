import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNegotiateLinkComponent } from './send-negotiate-link.component';

describe('SendNegotiateLinkComponent', () => {
  let component: SendNegotiateLinkComponent;
  let fixture: ComponentFixture<SendNegotiateLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNegotiateLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendNegotiateLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
