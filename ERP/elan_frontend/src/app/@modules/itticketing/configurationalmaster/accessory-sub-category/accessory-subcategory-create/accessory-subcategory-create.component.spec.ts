import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySubcategoryCreateComponent } from './accessory-subcategory-create.component';

describe('AccessorySubcategoryCreateComponent', () => {
  let component: AccessorySubcategoryCreateComponent;
  let fixture: ComponentFixture<AccessorySubcategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorySubcategoryCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessorySubcategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
