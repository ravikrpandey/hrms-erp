import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTripCategoryComponent } from './action-trip-category.component';

describe('ActionTripCategoryComponent', () => {
  let component: ActionTripCategoryComponent;
  let fixture: ComponentFixture<ActionTripCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTripCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionTripCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
