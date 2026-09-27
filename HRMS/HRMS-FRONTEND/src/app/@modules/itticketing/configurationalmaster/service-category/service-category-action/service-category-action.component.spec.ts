import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryActionComponent } from './service-category-action.component';

describe('ServiceCategoryActionComponent', () => {
  let component: ServiceCategoryActionComponent;
  let fixture: ComponentFixture<ServiceCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
