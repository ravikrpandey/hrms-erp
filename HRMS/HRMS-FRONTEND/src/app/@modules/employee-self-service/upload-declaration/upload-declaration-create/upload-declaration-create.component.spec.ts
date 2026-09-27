import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeclarationCreateComponent } from './upload-declaration-create.component';

describe('UploadDeclarationCreateComponent', () => {
  let component: UploadDeclarationCreateComponent;
  let fixture: ComponentFixture<UploadDeclarationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDeclarationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDeclarationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
