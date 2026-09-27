import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceActionComponent } from './price-action.component';

describe('PriceActionComponent', () => {
  let component: PriceActionComponent;
  let fixture: ComponentFixture<PriceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
