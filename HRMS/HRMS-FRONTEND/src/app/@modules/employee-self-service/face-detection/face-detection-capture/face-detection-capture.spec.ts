import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetectionCapture } from './face-detection-capture';

describe('FaceDetectionCapture', () => {
  let component: FaceDetectionCapture;
  let fixture: ComponentFixture<FaceDetectionCapture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceDetectionCapture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceDetectionCapture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
