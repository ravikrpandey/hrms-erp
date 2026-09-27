import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsubcategoryAction } from './assetsubcategory-action';

describe('AssetsubcategoryAction', () => {
  let component: AssetsubcategoryAction;
  let fixture: ComponentFixture<AssetsubcategoryAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsubcategoryAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsubcategoryAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
