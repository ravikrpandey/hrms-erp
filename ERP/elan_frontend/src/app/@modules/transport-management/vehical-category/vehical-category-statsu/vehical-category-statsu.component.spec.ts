import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalCategoryStatsuComponent } from './vehical-category-statsu.component';

describe('VehicalCategoryStatsuComponent', () => {
  let component: VehicalCategoryStatsuComponent;
  let fixture: ComponentFixture<VehicalCategoryStatsuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalCategoryStatsuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalCategoryStatsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
