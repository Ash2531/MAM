import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureTilesComponent } from './procedure-tiles.component';

describe('ProcedureTilesComponent', () => {
  let component: ProcedureTilesComponent;
  let fixture: ComponentFixture<ProcedureTilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcedureTilesComponent]
    });
    fixture = TestBed.createComponent(ProcedureTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
