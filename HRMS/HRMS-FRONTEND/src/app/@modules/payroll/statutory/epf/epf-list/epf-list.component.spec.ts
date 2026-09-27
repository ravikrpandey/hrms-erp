import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfListComponent } from './epf-list.component';

describe('EpfListComponent', () => {
  let component: EpfListComponent;
  let fixture: ComponentFixture<EpfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpfListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
