import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPaymentComponent } from './document-payment.component';

describe('DocumentPaymentComponent', () => {
  let component: DocumentPaymentComponent;
  let fixture: ComponentFixture<DocumentPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
