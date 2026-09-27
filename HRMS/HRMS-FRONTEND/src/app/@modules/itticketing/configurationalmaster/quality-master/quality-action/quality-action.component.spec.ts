import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityActionComponent } from './quality-action.component';

describe('QualityActionComponent', () => {
  let component: QualityActionComponent;
  let fixture: ComponentFixture<QualityActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
