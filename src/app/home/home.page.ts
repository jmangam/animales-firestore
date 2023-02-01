import { Component } from '@angular/core';
import { Animal } from '../animal';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router'



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  animalEditando: Animal;
  paramer: "A";
  arrayAnimales: any = [{
    id: "",
    data: {} as Animal
  }];

  constructor(private firestoreService: FirestoreService, private router:Router) {
    //Crear un animal vacio al empezar
    this.animalEditando = {} as Animal;

    this.obtenerListaAnimales();
  }

  obtenerListaAnimales() { console.log("1");
    this.firestoreService.consultar("animales").subscribe((resultadoConsultaAnimales) => {
      this.arrayAnimales = [];
      resultadoConsultaAnimales.forEach((datosAnimal: any) => {
        this.arrayAnimales.push({
          id: datosAnimal.payload.doc.id,
          data: datosAnimal.payload.doc.data()
        })
      })
    }
    )
  }

  idAnimalSelec: string;

  selecAnimal(animalSelec) {
    console.log("Animal seleccionado: ");
    console.log(animalSelec);
    this.idAnimalSelec = animalSelec.id;
    this.animalEditando.nombre = animalSelec.data.nombre;
    this.animalEditando.raza = animalSelec.data.raza;
    this.router.navigate(['/detalle', this.idAnimalSelec]);
  }

  clicBotonAnadir(){
    this.router.navigate(['/detalle', "A" ]);
  }

 

}


