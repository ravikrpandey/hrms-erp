import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpInvoiceListComponent } from './cp-invoice-list.component';

describe('CpInvoiceListComponent', () => {
  let component: CpInvoiceListComponent;
  let fixture: ComponentFixture<CpInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
