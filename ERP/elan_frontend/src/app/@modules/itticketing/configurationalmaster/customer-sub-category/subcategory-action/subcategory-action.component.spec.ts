import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryActionComponent } from './subcategory-action.component';

describe('SubCategoryActionComponent', () => {
  let component: SubCategoryActionComponent;
  let fixture: ComponentFixture<SubCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
