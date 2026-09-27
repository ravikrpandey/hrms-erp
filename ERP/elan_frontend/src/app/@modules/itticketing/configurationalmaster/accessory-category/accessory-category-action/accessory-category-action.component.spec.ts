import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoryActionComponent } from './accessory-category-action.component';

describe('AccessoryCategoryActionComponent', () => {
  let component: AccessoryCategoryActionComponent;
  let fixture: ComponentFixture<AccessoryCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
