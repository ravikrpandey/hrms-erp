import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemDilogComponent } from './pr-item-dilog.component';

describe('PrItemDilogComponent', () => {
  let component: PrItemDilogComponent;
  let fixture: ComponentFixture<PrItemDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrItemDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrItemDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
