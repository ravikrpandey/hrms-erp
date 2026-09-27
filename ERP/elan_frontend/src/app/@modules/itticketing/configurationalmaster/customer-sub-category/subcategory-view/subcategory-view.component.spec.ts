import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryViewComponent } from './subcategory-view.component';

describe('SubcategoryViewComponent', () => {
  let component: SubcategoryViewComponent;
  let fixture: ComponentFixture<SubcategoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
