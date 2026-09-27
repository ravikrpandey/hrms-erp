import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSendeComponent } from './email-sende.component';

describe('EmailSendeComponent', () => {
  let component: EmailSendeComponent;
  let fixture: ComponentFixture<EmailSendeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSendeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
