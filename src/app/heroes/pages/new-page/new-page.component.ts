import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  standalone: false,
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {
  public isEditMode = false;
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', [Validators.required]),
    publisher: new FormControl<Publisher | null>(null, [Validators.required]),
    alter_ego: new FormControl<string>('', [Validators.required]),
    first_appearance: new FormControl<string>('', [Validators.required]),
    characters: new FormControl<string>('', [Validators.required]),
    alt_img: new FormControl<string>('') // Campo para la URL de la imagen
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  constructor(
    private heroesService: HeroesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!heroId;

    if (this.isEditMode && heroId) {
      this.heroesService.getHeroById(heroId).subscribe(hero => {
        if (hero) {
          this.heroForm.patchValue(hero);
        }
      });
    }
  }

  get currentHero(): Hero {
    return this.heroForm.value as Hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    const heroData: Hero = this.currentHero;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: this.isEditMode ? '¿Deseas guardar los cambios?' : '¿Deseas agregar este nuevo héroe?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (this.isEditMode) {
        this.heroesService.updateHero(heroData).subscribe(() => {
          this.showSnackBar('Héroe actualizado correctamente');
          this.router.navigate(['/heroes']);
        });
      } else {
        this.heroesService.addHero(heroData).subscribe(() => {
          this.showSnackBar('Héroe agregado correctamente');
          this.router.navigate(['/heroes']);
        });
      }
    });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) {
      console.error('Error: No se puede eliminar un héroe sin ID.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas eliminar a ${this.currentHero.superhero}?` }
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id))
      )
      .subscribe(() => {
        this.showSnackBar('Héroe eliminado correctamente');
        this.router.navigate(['/heroes']);
      });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración del mensaje en milisegundos
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
