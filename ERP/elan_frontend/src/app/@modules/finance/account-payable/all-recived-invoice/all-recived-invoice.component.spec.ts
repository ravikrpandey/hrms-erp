import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecivedInvoiceComponent } from './all-recived-invoice.component';

describe('AllRecivedInvoiceComponent', () => {
  let component: AllRecivedInvoiceComponent;
  let fixture: ComponentFixture<AllRecivedInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRecivedInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRecivedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
