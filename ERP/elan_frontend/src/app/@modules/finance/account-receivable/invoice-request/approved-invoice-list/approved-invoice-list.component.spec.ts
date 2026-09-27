import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedInvoiceListComponent } from './approved-invoice-list.component';

describe('ApprovedInvoiceListComponent', () => {
  let component: ApprovedInvoiceListComponent;
  let fixture: ComponentFixture<ApprovedInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
