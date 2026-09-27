import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfCreateComponent } from './epf-create.component';

describe('EpfCreateComponent', () => {
  let component: EpfCreateComponent;
  let fixture: ComponentFixture<EpfCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpfCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpfCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
