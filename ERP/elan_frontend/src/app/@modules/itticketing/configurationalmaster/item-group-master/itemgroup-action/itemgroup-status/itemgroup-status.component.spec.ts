import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryStatusComponent } from './subcategory-status.component';

describe('SubcategoryStatusComponent', () => {
  let component: SubcategoryStatusComponent;
  let fixture: ComponentFixture<SubcategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
