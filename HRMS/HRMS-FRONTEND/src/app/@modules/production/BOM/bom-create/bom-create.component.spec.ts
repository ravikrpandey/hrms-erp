import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomCreateComponent } from './bom-create.component';

describe('BomCreateComponent', () => {
  let component: BomCreateComponent;
  let fixture: ComponentFixture<BomCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
