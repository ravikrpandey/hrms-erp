import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestListComponent } from './invoice-request-list.component';

describe('InvoiceRequestListComponent', () => {
  let component: InvoiceRequestListComponent;
  let fixture: ComponentFixture<InvoiceRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceRequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
