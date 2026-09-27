import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemComponent } from './pr-item.component';

describe('PrItemComponent', () => {
  let component: PrItemComponent;
  let fixture: ComponentFixture<PrItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
