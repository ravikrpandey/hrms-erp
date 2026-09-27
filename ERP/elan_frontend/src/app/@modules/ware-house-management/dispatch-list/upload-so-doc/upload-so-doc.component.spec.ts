import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSoDocComponent } from './upload-so-doc.component';

describe('UploadSoDocComponent', () => {
  let component: UploadSoDocComponent;
  let fixture: ComponentFixture<UploadSoDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSoDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSoDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
