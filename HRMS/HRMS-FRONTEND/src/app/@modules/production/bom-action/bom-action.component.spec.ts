import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomActionComponent } from './bom-action.component';

describe('BomActionComponent', () => {
  let component: BomActionComponent;
  let fixture: ComponentFixture<BomActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
