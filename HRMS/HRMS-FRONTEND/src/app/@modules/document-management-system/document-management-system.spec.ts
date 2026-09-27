import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentManagementSystem } from './document-management-system';

describe('DocumentManagementSystem', () => {
  let component: DocumentManagementSystem;
  let fixture: ComponentFixture<DocumentManagementSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentManagementSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentManagementSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
