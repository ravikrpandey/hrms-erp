import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmDialogComponent } from './ism-dialog.component';

describe('IsmDialogComponent', () => {
  let component: IsmDialogComponent;
  let fixture: ComponentFixture<IsmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
