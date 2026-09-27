import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsDialog } from './basic-details-dialog';

describe('BasicDetailsDialog', () => {
  let component: BasicDetailsDialog;
  let fixture: ComponentFixture<BasicDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
