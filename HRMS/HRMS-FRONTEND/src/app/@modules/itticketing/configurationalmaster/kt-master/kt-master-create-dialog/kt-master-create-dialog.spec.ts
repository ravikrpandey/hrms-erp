import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtMasterCreateDialog } from './kt-master-create-dialog';

describe('KtMasterCreateDialog', () => {
  let component: KtMasterCreateDialog;
  let fixture: ComponentFixture<KtMasterCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtMasterCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtMasterCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
