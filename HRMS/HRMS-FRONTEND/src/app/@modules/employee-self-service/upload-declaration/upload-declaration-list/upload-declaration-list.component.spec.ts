import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeclarationListComponent } from './upload-declaration-list.component';

describe('UploadDeclarationListComponent', () => {
  let component: UploadDeclarationListComponent;
  let fixture: ComponentFixture<UploadDeclarationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDeclarationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDeclarationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
