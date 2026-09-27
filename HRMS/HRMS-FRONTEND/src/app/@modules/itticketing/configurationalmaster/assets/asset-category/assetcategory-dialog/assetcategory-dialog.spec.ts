import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcategoryDialog } from './assetcategory-dialog';

describe('AssetcategoryDialog', () => {
  let component: AssetcategoryDialog;
  let fixture: ComponentFixture<AssetcategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetcategoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetcategoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
