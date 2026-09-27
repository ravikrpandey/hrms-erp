import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeclarationActionComponent } from './upload-declaration-action.component';

describe('UploadDeclarationActionComponent', () => {
  let component: UploadDeclarationActionComponent;
  let fixture: ComponentFixture<UploadDeclarationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDeclarationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDeclarationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
