import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcategoryStatus } from './assetcategory-status';

describe('AssetcategoryStatus', () => {
  let component: AssetcategoryStatus;
  let fixture: ComponentFixture<AssetcategoryStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetcategoryStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetcategoryStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
