import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedinterviewDialogComponent } from './fixedinterview-dialog.component';

describe('FixedinterviewDialogComponent', () => {
  let component: FixedinterviewDialogComponent;
  let fixture: ComponentFixture<FixedinterviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedinterviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedinterviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
