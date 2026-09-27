import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentManagementDialog } from './document-management-dialog';

describe('DocumentManagementDialog', () => {
  let component: DocumentManagementDialog;
  let fixture: ComponentFixture<DocumentManagementDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentManagementDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentManagementDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
