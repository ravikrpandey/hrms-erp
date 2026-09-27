import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerItemNameListComponent } from './customer-item-name-list.component';

describe('CustomerItemNameListComponent', () => {
  let component: CustomerItemNameListComponent;
  let fixture: ComponentFixture<CustomerItemNameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerItemNameListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerItemNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
