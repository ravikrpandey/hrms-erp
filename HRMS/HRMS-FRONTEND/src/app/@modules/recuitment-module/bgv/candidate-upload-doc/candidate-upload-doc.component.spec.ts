import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateUploadDocComponent } from './candidate-upload-doc.component';

describe('CandidateUploadDocComponent', () => {
  let component: CandidateUploadDocComponent;
  let fixture: ComponentFixture<CandidateUploadDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateUploadDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateUploadDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
