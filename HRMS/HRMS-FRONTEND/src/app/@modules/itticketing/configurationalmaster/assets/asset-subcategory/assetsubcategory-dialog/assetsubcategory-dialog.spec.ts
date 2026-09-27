import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsubcategoryDialog } from './assetsubcategory-dialog';

describe('AssetsubcategoryDialog', () => {
  let component: AssetsubcategoryDialog;
  let fixture: ComponentFixture<AssetsubcategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsubcategoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsubcategoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
