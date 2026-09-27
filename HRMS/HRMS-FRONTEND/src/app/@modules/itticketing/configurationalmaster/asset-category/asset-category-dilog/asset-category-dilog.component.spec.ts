import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryDilogComponent } from './asset-category-dilog.component';

describe('AssetCategoryDilogComponent', () => {
  let component: AssetCategoryDilogComponent;
  let fixture: ComponentFixture<AssetCategoryDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCategoryDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCategoryDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
