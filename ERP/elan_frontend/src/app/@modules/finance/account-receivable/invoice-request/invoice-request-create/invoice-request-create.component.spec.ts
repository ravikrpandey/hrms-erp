import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestCreateComponent } from './invoice-request-create.component';

describe('InvoiceRequestCreateComponent', () => {
  let component: InvoiceRequestCreateComponent;
  let fixture: ComponentFixture<InvoiceRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceRequestCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
