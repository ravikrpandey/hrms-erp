import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricemappingComponent } from './pricemapping.component';

describe('PricemappingComponent', () => {
  let component: PricemappingComponent;
  let fixture: ComponentFixture<PricemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricemappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
