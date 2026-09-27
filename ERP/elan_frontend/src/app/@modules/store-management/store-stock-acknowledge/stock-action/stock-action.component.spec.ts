import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockActionComponent } from './stock-action.component';

describe('StockActionComponent', () => {
  let component: StockActionComponent;
  let fixture: ComponentFixture<StockActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
