import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryDilogComponent } from './service-category-dilog.component';

describe('ServiceCategoryDilogComponent', () => {
  let component: ServiceCategoryDilogComponent;
  let fixture: ComponentFixture<ServiceCategoryDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCategoryDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
