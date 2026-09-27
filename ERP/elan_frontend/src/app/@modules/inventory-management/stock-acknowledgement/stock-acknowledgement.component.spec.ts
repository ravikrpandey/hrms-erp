import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAcknowledgementComponent } from './stock-acknowledgement.component';

describe('StockAcknowledgementComponent', () => {
  let component: StockAcknowledgementComponent;
  let fixture: ComponentFixture<StockAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAcknowledgementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
