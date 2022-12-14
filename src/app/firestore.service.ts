import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(animales, datos) {
    return this.angularFirestore.collection(animales).add(datos);
  }


  public consultar(animales) {
    return this.angularFirestore.collection(animales).snapshotChanges();
  }
}
