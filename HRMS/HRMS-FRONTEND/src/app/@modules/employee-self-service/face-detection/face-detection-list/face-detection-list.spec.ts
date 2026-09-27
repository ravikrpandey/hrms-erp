import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetectionList } from './face-detection-list';

describe('FaceDetectionList', () => {
  let component: FaceDetectionList;
  let fixture: ComponentFixture<FaceDetectionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceDetectionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceDetectionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
