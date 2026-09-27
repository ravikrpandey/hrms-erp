import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockListComponent } from './inventory-stock-list.component';

describe('InventoryStockListComponent', () => {
  let component: InventoryStockListComponent;
  let fixture: ComponentFixture<InventoryStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryStockListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
