import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderActionComponent } from './sales-order-action.component';

describe('SalesOrderActionComponent', () => {
  let component: SalesOrderActionComponent;
  let fixture: ComponentFixture<SalesOrderActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
