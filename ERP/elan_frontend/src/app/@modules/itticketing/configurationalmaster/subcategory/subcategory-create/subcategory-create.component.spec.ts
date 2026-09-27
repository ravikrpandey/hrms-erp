import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryCreateComponent } from './subcategory-create.component';

describe('SubcategoryCreateComponent', () => {
  let component: SubcategoryCreateComponent;
  let fixture: ComponentFixture<SubcategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
