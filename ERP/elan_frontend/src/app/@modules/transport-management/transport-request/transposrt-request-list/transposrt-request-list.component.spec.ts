import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransposrtRequestListComponent } from './transposrt-request-list.component';

describe('TransposrtRequestListComponent', () => {
  let component: TransposrtRequestListComponent;
  let fixture: ComponentFixture<TransposrtRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransposrtRequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransposrtRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
