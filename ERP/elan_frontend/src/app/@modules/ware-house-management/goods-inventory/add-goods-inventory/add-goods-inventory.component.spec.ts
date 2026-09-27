import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoodsInventoryComponent } from './add-goods-inventory.component';

describe('AddGoodsInventoryComponent', () => {
  let component: AddGoodsInventoryComponent;
  let fixture: ComponentFixture<AddGoodsInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGoodsInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGoodsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
