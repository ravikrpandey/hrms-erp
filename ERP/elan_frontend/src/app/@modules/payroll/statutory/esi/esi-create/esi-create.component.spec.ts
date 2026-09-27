import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsiCreateComponent } from './esi-create.component';

describe('EsiCreateComponent', () => {
  let component: EsiCreateComponent;
  let fixture: ComponentFixture<EsiCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsiCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsiCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
