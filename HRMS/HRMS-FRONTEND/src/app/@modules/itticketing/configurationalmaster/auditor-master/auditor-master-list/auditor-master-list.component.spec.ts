import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorListComponent } from './auditor-master-list.component';

describe('AuditorListComponent', () => {
  let component: AuditorListComponent;
  let fixture: ComponentFixture<AuditorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
