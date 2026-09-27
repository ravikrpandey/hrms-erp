import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryStatusActionComponent } from './asset-category-status-action.component';

describe('AssetCategoryStatusActionComponent', () => {
  let component: AssetCategoryStatusActionComponent;
  let fixture: ComponentFixture<AssetCategoryStatusActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCategoryStatusActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCategoryStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
