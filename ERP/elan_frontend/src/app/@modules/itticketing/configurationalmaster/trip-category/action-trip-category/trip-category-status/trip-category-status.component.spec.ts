import { ComponentFixture, TestBed } from '@angular/core/testing';

import { tripCategoryComponent } from './trip-category-status.component';

describe('tripCategoryComponent', () => {
  let component: tripCategoryComponent;
  let fixture: ComponentFixture<tripCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ tripCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(tripCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
