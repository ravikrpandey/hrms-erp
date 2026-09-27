import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcategoryAction } from './assetcategory-action';

describe('AssetcategoryAction', () => {
  let component: AssetcategoryAction;
  let fixture: ComponentFixture<AssetcategoryAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetcategoryAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetcategoryAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
