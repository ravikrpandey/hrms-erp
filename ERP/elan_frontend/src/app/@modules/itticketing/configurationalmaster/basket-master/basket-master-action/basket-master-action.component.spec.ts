import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMasterActionComponent } from './basket-master-action.component';

describe('BasketMasterActionComponent', () => {
  let component: BasketMasterActionComponent;
  let fixture: ComponentFixture<BasketMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
