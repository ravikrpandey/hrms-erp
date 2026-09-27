import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreStockAcknowledgeComponent } from './store-stock-acknowledge.component';

describe('StoreStockAcknowledgeComponent', () => {
  let component: StoreStockAcknowledgeComponent;
  let fixture: ComponentFixture<StoreStockAcknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreStockAcknowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreStockAcknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
