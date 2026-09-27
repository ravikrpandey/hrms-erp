import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMasterComponent } from './basket-master.component';

describe('BasketMasterComponent', () => {
  let component: BasketMasterComponent;
  let fixture: ComponentFixture<BasketMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
