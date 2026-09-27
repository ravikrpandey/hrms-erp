import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoryStatusActionComponent } from './accessory-category-status-action.component';

describe('AccessoryCategoryStatusActionComponent', () => {
  let component: AccessoryCategoryStatusActionComponent;
  let fixture: ComponentFixture<AccessoryCategoryStatusActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryCategoryStatusActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryCategoryStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
