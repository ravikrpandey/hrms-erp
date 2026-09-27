import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryStatusActionComponent } from './service-category-status-action.component';

describe('ServiceCategoryStatusActionComponent', () => {
  let component: ServiceCategoryStatusActionComponent;
  let fixture: ComponentFixture<ServiceCategoryStatusActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCategoryStatusActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
