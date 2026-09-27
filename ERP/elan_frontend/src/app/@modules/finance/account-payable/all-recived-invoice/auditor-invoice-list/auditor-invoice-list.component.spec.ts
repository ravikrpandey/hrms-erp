import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorInvoiceListComponent } from './auditor-invoice-list.component';

describe('AuditorInvoiceListComponent', () => {
  let component: AuditorInvoiceListComponent;
  let fixture: ComponentFixture<AuditorInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
