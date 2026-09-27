import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySubCategoryStatusComponent } from './accessory-subcategory-status.component';

describe('AccessorySubCategoryStatusComponent', () => {
  let component: AccessorySubCategoryStatusComponent;
  let fixture: ComponentFixture<AccessorySubCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorySubCategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessorySubCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
