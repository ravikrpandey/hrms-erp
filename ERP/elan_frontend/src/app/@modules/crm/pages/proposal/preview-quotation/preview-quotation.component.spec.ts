import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewQuotationComponent } from './preview-quotation.component';

describe('PreviewQuotationComponent', () => {
  let component: PreviewQuotationComponent;
  let fixture: ComponentFixture<PreviewQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
