import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfActionComponent } from './epf-action.component';

describe('EpfActionComponent', () => {
  let component: EpfActionComponent;
  let fixture: ComponentFixture<EpfActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpfActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpfActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
