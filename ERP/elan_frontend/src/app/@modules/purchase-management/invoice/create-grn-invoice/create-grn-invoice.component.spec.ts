import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGrnInvoiceComponent } from './create-grn-invoice.component';

describe('CreateGrnInvoiceComponent', () => {
  let component: CreateGrnInvoiceComponent;
  let fixture: ComponentFixture<CreateGrnInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGrnInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGrnInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
