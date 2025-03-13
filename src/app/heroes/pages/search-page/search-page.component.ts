import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Hero } from '../../interfaces/hero.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-search-page',
  standalone:false,
  templateUrl: './search-page.component.html',
  styles: [
    `
/* Contenedor principal de la búsqueda */
.search-container {
  text-align: center;
  padding: 3rem;
}


/* Imagen centrada */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}


/* Imagen del héroe con zoom */
.hero-image {
  width: 100%;
  max-width: 250px;
  border-radius: 12px;
}
/* Estilos del contenedor de detalles del héroe */
.hero-details {
  border: 1px solid #ccc;
  padding: 2rem;
  border-radius: 12px;
  color: #fff; /* Texto blanco */
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
  max-width: 450px;
  margin: 3rem auto;
  text-align: center;
}



/* Estilo para el nombre del héroe */
.hero-details h2 {
  color: #fff;
  margin-bottom: 1rem;
  opacity: 0;
}


/* Estilos generales para layout */
.full-width {
  width: 100%;
}

    `
  ]
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private heroesService: HeroesService) {}

  searchHero() {
    const value: string = this.searchInput.value || '';
    this.heroesService.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    // Asigna el héroe seleccionado para mostrar los detalles
    this.selectedHero = hero;
  }
}
