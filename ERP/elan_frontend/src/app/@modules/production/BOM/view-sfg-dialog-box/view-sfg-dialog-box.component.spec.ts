import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSfgDialogBoxComponent } from './view-sfg-dialog-box.component';

describe('ViewSfgDialogBoxComponent', () => {
  let component: ViewSfgDialogBoxComponent;
  let fixture: ComponentFixture<ViewSfgDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSfgDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSfgDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
