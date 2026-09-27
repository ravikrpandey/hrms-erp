import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoryComponent } from './accessory-category.component';

describe('AccessoryCategoryComponent', () => {
  let component: AccessoryCategoryComponent;
  let fixture: ComponentFixture<AccessoryCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
