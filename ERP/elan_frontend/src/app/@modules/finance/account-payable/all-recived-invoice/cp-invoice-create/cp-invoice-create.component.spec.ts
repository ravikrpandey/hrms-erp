import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpInvoiceCreateComponent } from './cp-invoice-create.component';

describe('CpInvoiceCreateComponent', () => {
  let component: CpInvoiceCreateComponent;
  let fixture: ComponentFixture<CpInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpInvoiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
