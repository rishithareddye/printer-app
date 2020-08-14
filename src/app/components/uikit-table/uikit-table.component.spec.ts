import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UikitTableComponent } from './uikit-table.component';

describe('UikitTableComponent', () => {
  let component: UikitTableComponent;
  let fixture: ComponentFixture<UikitTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UikitTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UikitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
