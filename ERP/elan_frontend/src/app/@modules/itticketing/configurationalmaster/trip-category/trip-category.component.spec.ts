import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCategoryComponent } from './trip-category.component';

describe('TripCategoryComponent', () => {
  let component: TripCategoryComponent;
  let fixture: ComponentFixture<TripCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
