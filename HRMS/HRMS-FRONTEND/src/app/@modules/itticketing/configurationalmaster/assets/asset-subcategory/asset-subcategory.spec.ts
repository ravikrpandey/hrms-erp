import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSubcategory } from './asset-subcategory';

describe('AssetSubcategory', () => {
  let component: AssetSubcategory;
  let fixture: ComponentFixture<AssetSubcategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSubcategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSubcategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
