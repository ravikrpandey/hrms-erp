import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpInvoicePaybleListComponent } from './cp-invoice-list.component';

describe('CpInvoiceListComponent', () => {
  let component: CpInvoicePaybleListComponent;
  let fixture: ComponentFixture<CpInvoicePaybleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpInvoicePaybleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpInvoicePaybleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
