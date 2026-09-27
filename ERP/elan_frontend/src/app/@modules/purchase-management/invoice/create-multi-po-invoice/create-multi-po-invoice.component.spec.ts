import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMultiPoInvoiceComponent } from './create-multi-po-invoice.component';

describe('CreateMultiPoInvoiceComponent', () => {
  let component: CreateMultiPoInvoiceComponent;
  let fixture: ComponentFixture<CreateMultiPoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMultiPoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMultiPoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
