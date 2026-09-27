import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffDialogComponent } from './comp-off-dialog.component';

describe('CompOffDialogComponent', () => {
  let component: CompOffDialogComponent;
  let fixture: ComponentFixture<CompOffDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompOffDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompOffDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
