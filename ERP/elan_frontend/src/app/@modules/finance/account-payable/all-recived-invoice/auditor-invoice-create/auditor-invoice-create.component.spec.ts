import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorInvoiceCreateComponent } from './auditor-invoice-create.component';

describe('AuditorInvoiceCreateComponent', () => {
  let component: AuditorInvoiceCreateComponent;
  let fixture: ComponentFixture<AuditorInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorInvoiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
