import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalCategoryComponent } from './vehical-category.component';

describe('VehicalCategoryComponent', () => {
  let component: VehicalCategoryComponent;
  let fixture: ComponentFixture<VehicalCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
