import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityStatusComponent } from './quality-status.component';

describe('QualityStatusComponent', () => {
  let component: QualityStatusComponent;
  let fixture: ComponentFixture<QualityStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
