import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStatusPopComponent } from './quotation-status-pop.component';

describe('QuotationStatusPopComponent', () => {
  let component: QuotationStatusPopComponent;
  let fixture: ComponentFixture<QuotationStatusPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationStatusPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationStatusPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
