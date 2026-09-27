import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryActionComponent } from './asset-category-action.component';

describe('AssetCategoryActionComponent', () => {
  let component: AssetCategoryActionComponent;
  let fixture: ComponentFixture<AssetCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
