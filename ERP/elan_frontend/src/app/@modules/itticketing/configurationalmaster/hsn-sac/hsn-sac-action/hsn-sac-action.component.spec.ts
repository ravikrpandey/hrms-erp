import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnSacActionComponent } from './hsn-sac-action.component';

describe('HsnSacActionComponent', () => {
  let component: HsnSacActionComponent;
  let fixture: ComponentFixture<HsnSacActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsnSacActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnSacActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
