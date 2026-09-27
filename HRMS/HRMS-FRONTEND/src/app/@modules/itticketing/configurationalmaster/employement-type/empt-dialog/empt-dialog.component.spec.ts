import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptDialogComponent } from './empt-dialog.component';

describe('EmptDialogComponent', () => {
  let component: EmptDialogComponent;
  let fixture: ComponentFixture<EmptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
