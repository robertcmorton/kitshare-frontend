import { Component,
  OnInit,
  ViewChild,
  Input } from '@angular/core';

@Component({
  selector: 'kit-address-map',
  templateUrl: './address-map.component.html',
  styleUrls: ['./address-map.component.scss']
})
export class AddressMapComponent implements OnInit {

  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  @Input() list:any;

  constructor() { }

  ngOnInit(): void {
    this.generateGoogleMap(); 
  }

  generateGoogleMap() {
    console.log('list',this.list)
    var center_of_map = {
      lat: Number(this.list[0].lat),
      lng: Number(this.list[0].lng)
    };
    var bounds = new google.maps.LatLngBounds();
    var mapProp = {
      center: center_of_map,
      zoom: 4,
      maxZoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var markers = [];
    

    this.list.forEach(element => {
      console.log(element)
      let marker_temp_obj = {
        lat: element.lat,
        lng: element.lng,
        name: element.street_address_line2
      };
      markers.push(marker_temp_obj);
    });
    var markerIcon = {
      url: 'https://www.kitshare.com.au/assets/images/mapIcons/kitshare-map-icon@2x.png', // BLUE MARKER NEW
      scaledSize: new google.maps.Size(41, 41),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 40)
    };

    // Loop through our array of markers & place each one on the map
    for (let i = 0; i < markers.length; i++) {
      let price: any = parseFloat(markers[i].price).toFixed(2);
      var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(position);
      this.marker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: markerIcon,
        title: markers[i].name
      });
    }
  }

}
