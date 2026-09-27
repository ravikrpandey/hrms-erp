import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySubcategoryActionComponent } from './accessory-subcategory-action.component';

describe('AccessorySubcategoryActionComponent', () => {
  let component: AccessorySubcategoryActionComponent;
  let fixture: ComponentFixture<AccessorySubcategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorySubcategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessorySubcategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
