import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySubcategoryComponent } from './accessory-subcategory.component';

describe('AccessorySubcategoryComponent', () => {
  let component: AccessorySubcategoryComponent;
  let fixture: ComponentFixture<AccessorySubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorySubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessorySubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
