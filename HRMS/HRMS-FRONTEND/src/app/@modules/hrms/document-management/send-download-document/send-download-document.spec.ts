import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDownloadDocument } from './send-download-document';

describe('SendDownloadDocument', () => {
  let component: SendDownloadDocument;
  let fixture: ComponentFixture<SendDownloadDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendDownloadDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendDownloadDocument);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
