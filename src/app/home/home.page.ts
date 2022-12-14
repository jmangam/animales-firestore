import { Component } from '@angular/core';
import { Animal } from '../animal';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  animalEditando: Animal;
  arrayAnimales: any = [{
    id: "",
    data: {} as Animal
  }];

  constructor(private firestoreService: FirestoreService) {
    //Crear un animal vacio al empezar
    this.animalEditando = {} as Animal;

    this.obtenerListaAnimales();
  }



  clicBotonInsertar() {
    this.firestoreService.insertar("animales", this.animalEditando)
    .then(() => {
      console.log("Animal creado correctamente");
      //Limpiar el contenido del animal que estaba editando
      this.animalEditando ={} as Animal;

    }, (error) =>{
      console.error(error);
    });
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

}
