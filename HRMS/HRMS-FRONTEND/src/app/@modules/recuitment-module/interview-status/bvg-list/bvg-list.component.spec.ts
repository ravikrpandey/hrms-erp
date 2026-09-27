import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BvgListComponent } from './bvg-list.component';

describe('BvgListComponent', () => {
  let component: BvgListComponent;
  let fixture: ComponentFixture<BvgListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BvgListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BvgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
