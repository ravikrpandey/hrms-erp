import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategory } from './asset-category';

describe('AssetCategory', () => {
  let component: AssetCategory;
  let fixture: ComponentFixture<AssetCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
