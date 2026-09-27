import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectInvoiceListComponent } from './reject-invoice-list.component';

describe('RejectInvoiceListComponent', () => {
  let component: RejectInvoiceListComponent;
  let fixture: ComponentFixture<RejectInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
