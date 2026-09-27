import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsDocumentsComponent } from './attachments-documents.component';

describe('AttachmentsDocumentsComponent', () => {
  let component: AttachmentsDocumentsComponent;
  let fixture: ComponentFixture<AttachmentsDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
