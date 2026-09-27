import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalCategoryActionComponent } from './vehical-category-action.component';

describe('VehicalCategoryActionComponent', () => {
  let component: VehicalCategoryActionComponent;
  let fixture: ComponentFixture<VehicalCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
