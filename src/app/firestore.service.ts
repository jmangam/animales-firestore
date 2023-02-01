import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) { }

  public insertar(animales, datos) {
    return this.angularFirestore.collection(animales).add(datos);
  }

  public consultar(animales) {
    return this.angularFirestore.collection(animales).snapshotChanges();
  }

  public borrar(animales, documentId) {
   return this.angularFirestore.collection(animales).doc(documentId).delete();
  }
  
  public actualizar(animales, documentId, datos) {
    return this.angularFirestore.collection(animales).doc(documentId).set(datos);
   }

   public consultarPorId(animales, documentId) {
    return this.angularFirestore.collection(animales).doc(documentId).snapshotChanges();
  }

  public cargarImagen(nombreCarpeta, nombreArchivo, imagenBase64) {
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  public deleteFileFromURL(fileURL) {
    return this.angularFireStorage.storage.refFromURL(fileURL).delete();
  }
}

