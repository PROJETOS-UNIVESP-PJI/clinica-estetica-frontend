import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroInteressadosComponent } from './cadastro-interessados.component';

describe('CadastroInteressadosComponent', () => {
  let component: CadastroInteressadosComponent;
  let fixture: ComponentFixture<CadastroInteressadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroInteressadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroInteressadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
