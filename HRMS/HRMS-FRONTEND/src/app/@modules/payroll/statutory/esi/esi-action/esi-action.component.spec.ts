import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsiActionComponent } from './esi-action.component';

describe('EsiActionComponent', () => {
  let component: EsiActionComponent;
  let fixture: ComponentFixture<EsiActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsiActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsiActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
