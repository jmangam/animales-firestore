import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Animal } from '../animal';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  
  document: any = {
    id: "",
    data: {} as Animal
  };

  id: string = ""

  
  constructor(private activatedRouted:ActivatedRoute, private firestoreService: FirestoreService, private router:Router, 
    private alertController: AlertController, 
    private loadingController: LoadingController, 
    private toastController: ToastController, 
    private imagePicker: ImagePicker,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing) { 
 }

  ngOnInit() {
    this.id = this.activatedRouted.snapshot.paramMap.get('id');
    console.log(this.id);
    this.firestoreService.consultarPorId("animales", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el nombre del animal en consola
        console.log(this.document.data.nombre);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Animal;
      } 
    });
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("animales", this.document.data)
    .then(() => {
      console.log("Animal creado correctamente");
      //Limpiar el contenido del animal que estaba editando
      this.document.data ={} as Animal;
      this.router.navigate(['/home']);

    }, (error) =>{
      console.error(error);
    });
  }

  clicBotonBorrar() {
    this.deleteFile(this.document.data.imagen);
    this.firestoreService.borrar("animales", this.document.id).then(() => {
      // Limpiar datos de pantalla
      this.document.data = {} as Animal;
      this.router.navigate(['/home']);
    })
    
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("animales", this.document.id, this.document.data).then(() => {
      this.document.data = {} as Animal;
      this.router.navigate(['/home']);
    })
  }

  idAnimalSelec: string;

  selecAnimal(animalSelec) {
    console.log("Animal seleccionado: ");
    console.log(animalSelec);
    this.idAnimalSelec = animalSelec.id;
    this.document.data.nombre = animalSelec.data.nombre;
    this.document.data.raza = animalSelec.data.raza;
    this.router.navigate(['/detalle', this.idAnimalSelec]);
  }

  clicBotonVolver() {
    this.router.navigate(['/home'])
  }


  async alertBorrado() {
    console.log(this.document.data.imagen);
    const alert = await this.alertController.create({
      header: 'Advertencia',
      subHeader:'¿Estas seguro de que quieres borrar este animal?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar',
          handler: () => {
          },
        },
        {
          text: 'Confirmar',
          role: 'confirmar',
          handler: () => {
            this.clicBotonBorrar();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }


  async uploadImagePicker() {
    const loading = await this.loadingController.create({
      message: 'please wait...',
    });

    const toast = await this.toastController.create({
      message: 'image was updated successfully',
      duration: 3000,
    });

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1,
              outputType: 1,
            })
            .then(
              (results) => {
                let nombreCarpeta = 'imagenes';

                for (let i = 0; i < results.length; i++) {
                  loading.present();

                  let nombreImagen = `${new Date().getTime()}`;

                  this.firestoreService.cargarImagen(nombreCarpeta, nombreImagen, results[i]).then((snapshot) => {
                      snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('downloadURL:' + downloadURL);
                        this.document.data.imagen=downloadURL;
                        toast.present();
                        loading.dismiss();
                      });
                    });
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration : 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL).then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }

  regularSharing() {
    this.socialSharing.share(`Nombre: ${this.document.data.nombre} \nRaza: ${this.document.data.raza}\n`, null, null, null).then(() => {
      console.log("Datos compartidos");
    }).catch((error) => {
      console.log("Se ha producido un error: " + error);
    });
   }

   llamada(){
    this.callNumber.callNumber("18001010101", true)
    .then(res => console.log('LLamada realizada!', res))
    .catch(err => console.log('Error al iniciar llamada', err));
   }


}
