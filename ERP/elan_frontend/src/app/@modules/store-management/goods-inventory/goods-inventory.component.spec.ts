import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsInventoryComponent } from './goods-inventory.component';

describe('GoodsInventoryComponent', () => {
  let component: GoodsInventoryComponent;
  let fixture: ComponentFixture<GoodsInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
