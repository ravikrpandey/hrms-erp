import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementActionComponent } from './store-management-action.component';

describe('StoreManagementActionComponent', () => {
  let component: StoreManagementActionComponent;
  let fixture: ComponentFixture<StoreManagementActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreManagementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
