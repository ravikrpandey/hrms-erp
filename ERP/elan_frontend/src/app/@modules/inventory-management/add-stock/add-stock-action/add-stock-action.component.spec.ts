import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockActionComponent } from './add-stock-action.component';

describe('AddStockActionComponent', () => {
  let component: AddStockActionComponent;
  let fixture: ComponentFixture<AddStockActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
