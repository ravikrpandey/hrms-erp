import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityControlActionComponent } from './quality-control-action.component';

describe('QualityControlActionComponent', () => {
  let component: QualityControlActionComponent;
  let fixture: ComponentFixture<QualityControlActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityControlActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityControlActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
