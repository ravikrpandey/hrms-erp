import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCostCategoryComponent } from './item-cost-category.component';

describe('ItemCostCategoryComponent', () => {
  let component: ItemCostCategoryComponent;
  let fixture: ComponentFixture<ItemCostCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCostCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCostCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
