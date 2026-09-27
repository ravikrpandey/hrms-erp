import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoInvoiceComponent } from './create-so-invoice.component';

describe('CreateSoInvoiceComponent', () => {
  let component: CreateSoInvoiceComponent;
  let fixture: ComponentFixture<CreateSoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
