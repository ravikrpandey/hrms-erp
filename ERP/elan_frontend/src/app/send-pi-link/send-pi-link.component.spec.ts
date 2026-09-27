import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPiLinkComponent } from './send-pi-link.component';

describe('SendPiLinkComponent', () => {
  let component: SendPiLinkComponent;
  let fixture: ComponentFixture<SendPiLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPiLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPiLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
