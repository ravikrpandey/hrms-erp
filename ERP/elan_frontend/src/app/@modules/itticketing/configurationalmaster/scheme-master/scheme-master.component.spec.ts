import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMasterComponent } from './scheme-master.component';

describe('SchemeMasterComponent', () => {
  let component: SchemeMasterComponent;
  let fixture: ComponentFixture<SchemeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
