import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsubcategoryStatus } from './assetsubcategory-status';

describe('AssetsubcategoryStatus', () => {
  let component: AssetsubcategoryStatus;
  let fixture: ComponentFixture<AssetsubcategoryStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsubcategoryStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsubcategoryStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
