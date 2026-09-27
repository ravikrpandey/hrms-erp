import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCheckComponent } from './quality-check.component';

describe('QualityCheckComponent', () => {
  let component: QualityCheckComponent;
  let fixture: ComponentFixture<QualityCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
