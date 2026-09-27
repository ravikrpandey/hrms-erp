import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomListComponent } from './bom-list.component';

describe('BomListComponent', () => {
  let component: BomListComponent;
  let fixture: ComponentFixture<BomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
