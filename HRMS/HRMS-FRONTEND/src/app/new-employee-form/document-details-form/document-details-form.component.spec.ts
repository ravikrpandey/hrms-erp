import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsFormComponent } from './document-details-form.component';

describe('DocumentDetailsFormComponent', () => {
  let component: DocumentDetailsFormComponent;
  let fixture: ComponentFixture<DocumentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
