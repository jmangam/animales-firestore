import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  map: L.Map;
  constructor() { }

  ngOnInit() {
  }


  ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.65985045832144;
    let longitud = -6.128129718777444;
    let zoom = 17;
    let marker;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
        
    marker = L.marker([latitud, longitud]).addTo(this.map);
    

    marker.bindPopup('<h4>C.M.P.A. Centro Municipal de Protección Animal<h4> <br> <li>Teléfono: 956 14 95 33</li><li>Dirección: 11408 Jerez de la Frontera, Cádiz</li><li>Provincia: Cádiz</li>');

}
}
