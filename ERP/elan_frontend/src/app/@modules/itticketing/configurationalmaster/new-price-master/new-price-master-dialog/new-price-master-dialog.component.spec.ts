import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPriceMasterDialogComponent } from './new-price-master-dialog.component';

describe('NewPriceMasterDialogComponent', () => {
  let component: NewPriceMasterDialogComponent;
  let fixture: ComponentFixture<NewPriceMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPriceMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPriceMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
