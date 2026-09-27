import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripCategoryComponent } from './add-trip-category.component';

describe('AddTripCategoryComponent', () => {
  let component: AddTripCategoryComponent;
  let fixture: ComponentFixture<AddTripCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTripCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTripCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
