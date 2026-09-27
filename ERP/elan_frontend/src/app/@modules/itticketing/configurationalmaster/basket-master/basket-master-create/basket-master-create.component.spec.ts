import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMasterCreateComponent } from './basket-master-create.component';

describe('BasketMasterCreateComponent', () => {
  let component: BasketMasterCreateComponent;
  let fixture: ComponentFixture<BasketMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
