import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryPendingListComponent } from './salery-pending-list.component';

describe('SaleryPendingListComponent', () => {
  let component: SaleryPendingListComponent;
  let fixture: ComponentFixture<SaleryPendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryPendingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryPendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
