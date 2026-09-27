import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBatchDialogComponent } from './generate-batch-dialog.component';

describe('GenerateBatchDialogComponent', () => {
  let component: GenerateBatchDialogComponent;
  let fixture: ComponentFixture<GenerateBatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBatchDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
