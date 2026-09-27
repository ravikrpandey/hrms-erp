import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehicalCategoryComponent } from './create-vehical-category.component';

describe('CreateVehicalCategoryComponent', () => {
  let component: CreateVehicalCategoryComponent;
  let fixture: ComponentFixture<CreateVehicalCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehicalCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehicalCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
