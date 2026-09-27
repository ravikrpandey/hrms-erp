import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoryDilogComponent } from './accessory-category-dilog.component';

describe('AssetCategoryDilogComponent', () => {
  let component: AccessoryCategoryDilogComponent;
  let fixture: ComponentFixture<AccessoryCategoryDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryCategoryDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryCategoryDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
