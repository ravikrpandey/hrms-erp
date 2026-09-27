import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCreateComponent } from './quality-create.component';

describe('QualityCreateComponent', () => {
  let component: QualityCreateComponent;
  let fixture: ComponentFixture<QualityCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
