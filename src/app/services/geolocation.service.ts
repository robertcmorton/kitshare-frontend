import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SearchService } from "./search.service";
import { AppService } from "../app.service";
import { environment } from "../../environments/environment";
import Geocoder = google.maps.Geocoder;
import GeocoderStatus = google.maps.GeocoderStatus;
import GeocoderResult = google.maps.GeocoderResult;
import LatLngBounds = google.maps.LatLngBounds;
import LatLng = google.maps.LatLng;

@Injectable()
export class GeolocationService {
  address$ = new BehaviorSubject("Australia");

  bounds$ = new BehaviorSubject(
    new LatLngBounds(new LatLng(-50, 100), new LatLng(-10, 150))
  );

  currentBounds: LatLngBounds;
  currentAddress;
  mapZoom = 9;
  addressChange = true;

  desktop = true;

  constructor(
    private searchService: SearchService,
    private appService: AppService
  ) {
    this.getUserPosition();
    this.appService.onResize$.subscribe((size) => {
      this.desktop = size >= environment.breakpoints.desktop;
    });
  }

  async addressChanged(address, fromFooter = false) {
    if (address === this.currentAddress) {
      return;
    }
    this.addressChange = true;
    this.currentAddress = address;
    this.address$.next(this.currentAddress);
    if (!address) {
      return;
    }

    this.currentBounds = await this.getBoundsByAddress(address);
    this.searchService.setSearchParams({
      address:
        this.currentAddress.trim() != "Australia" ? this.currentAddress : "",
      la: null,
      lng: null,
      radius: null,
    });
    this.bounds$.next(this.currentBounds);
    if (fromFooter) {
      const latNorth = this.currentBounds.getNorthEast().lat().toString();
      const latSouth = this.currentBounds.getSouthWest().lat().toString();
      const lngEast = this.currentBounds.getNorthEast().lng().toString();
      const lngWest = this.currentBounds.getSouthWest().lng().toString();
      this.searchService.setSearchParams({
        latNorth,
        latSouth,
        lngEast,
        lngWest,
      });
    }
    // const coordinates = await this.getCoordinatesByAddress(address);
    // this.coordinates$.next(coordinates);
  }

  async boundsChanged(bounds: LatLngBounds) {
    if (bounds.equals(this.currentBounds)) {
      return;
    }
    // this.currentBounds = bounds;
    // const center = bounds.getCenter();
    // const R = 6378137; // Earth’s mean radius in meter
    // const shortestCurve = Math.min(Math.abs(bounds.getNorthEast().lng() - bounds.getSouthWest().lng()),
    //   Math.abs(bounds.getSouthWest().lng() - bounds.getNorthEast().lng()));
    // const radius = Math.floor(0.4 * shortestCurve * R * Math.PI / 180).toString();
    const latNorth = bounds.getNorthEast().lat().toString();
    const latSouth = bounds.getSouthWest().lat().toString();
    const lngEast = bounds.getNorthEast().lng().toString();
    const lngWest = bounds.getSouthWest().lng().toString();
    this.searchService.setSearchParams({
      address: null,
      latNorth,
      latSouth,
      lngEast,
      lngWest,
    });
    try {
      if (this.addressChange) {
        this.addressChange = false;
        return;
      }
      this.currentAddress = await this.getAddressByBounds(bounds);
      this.address$.next(this.currentAddress);
    } catch (error) {
      this.currentAddress = null;
      this.address$.next(null);
    }
  }

  getUserPosition() {
    try {
      if (!navigator.geolocation) {
        return;
      }
      navigator.geolocation.getCurrentPosition((position) => {
        const gcd = new Geocoder();
        const lat = position && position.coords && position.coords.latitude;
        const lng = position && position.coords && position.coords.longitude;
        if (!lat || !lng) {
          return;
        }
        gcd.geocode({ location: { lat, lng } }, (result, status) =>
          this.parseGeocoderResultAndSetAddress(result, status)
        );
      });
    } catch (e) {
      return;
    }
  }

  parseGeocoderResultAndSetAddress(result, status) {
    const address = this.parseGeocoderResult(result, status);
    console.log("parseGeocoderResultAndSetAddress", address);
    if (address) {
      this.addressChanged(address).catch((error) => console.log(error));
    }
  }

  parseGeocoderResult(result, status): string | null {
    if (status !== GeocoderStatus.OK) {
      return null;
    }
    let address = this.getAddressFromGeocoderResult(result, "locality");
    if (!address) {
      address = this.getAddressFromGeocoderResult(
        result,
        "administrative_area_level_1"
      );
    }
    if (!address) {
      address = this.getAddressFromGeocoderResult(result, "country");
    }
    return address;
  }

  getAddressFromGeocoderResult(result, addressType) {
    let address = null;
    result.forEach((res) => {
      if (res.types.includes(addressType)) {
        res.address_components.forEach((component) => {
          if (component.types.includes(addressType)) {
            address = res.formatted_address;
          }
        });
      }
    });
    return address;
  }

  getCoordinatesByAddress(address): Promise<{ lat; lng }> {
    const gcd = new Geocoder();
    return new Promise((resolve, reject) => {
      try {
        gcd.geocode({ address }, (results: GeocoderResult[], status) => {
          if (status !== GeocoderStatus.OK) {
            reject(null);
          }
          if (!results || !results.length) {
            reject(null);
          }
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          resolve({ lat, lng });
        });
      } catch (error) {
        reject(null);
      }
    });
  }

  getAddressByBounds(bounds: LatLngBounds): Promise<string> {
    const gcd = new Geocoder();
    return new Promise((resolve, reject) => {
      try {
        const location = bounds.getCenter();
        gcd.geocode(
          { bounds, location },
          (results: GeocoderResult[], status) => {
            if (status !== GeocoderStatus.OK) {
              reject(null);
            }
            if (!results || !results.length) {
              reject(null);
            }
            const result = this.parseGeocoderResult(results, status);
            resolve(result);
          }
        );
      } catch (error) {
        reject(null);
      }
    });
  }

  getBoundsByAddress(address): Promise<LatLngBounds> {
    const gcd = new Geocoder();
    return new Promise((resolve, reject) => {
      try {
        gcd.geocode({ address }, (results: GeocoderResult[], status) => {
          if (status !== GeocoderStatus.OK) {
            reject(null);
          }
          results && results.length && results[0].geometry
            ? resolve(this.processBounds(results[0].geometry.bounds))
            : reject(null);
        });
      } catch (error) {
        reject(null);
      }
    });
  }

  processBounds(bounds: LatLngBounds) {
    if (bounds) {
      if (this.desktop) {
        return bounds;
      } else {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        const latDiff =
          Math.abs(Math.abs(northEast.lat()) - Math.abs(southWest.lat())) * 0.5;
        const lngDiff =
          Math.abs(Math.abs(northEast.lng()) - Math.abs(southWest.lng())) * 0.5;
        console.log({ latDiff, nel: northEast.lat(), swl: southWest.lat() });
        console.log({ lngDiff, nel: northEast.lng(), swl: southWest.lng() });
        const newNorthLat = northEast.lat() + latDiff;
        const newSouthLat = southWest.lat() - latDiff;
        const newEastLng = northEast.lng() + lngDiff;
        const newWestLng = southWest.lng() - lngDiff;
        console.log({
          old: bounds.toJSON(),
          new: new LatLngBounds(
            new LatLng(newSouthLat, newWestLng),
            new LatLng(newNorthLat, newEastLng)
          ).toJSON(),
        });
        return new LatLngBounds(
          new LatLng(newSouthLat, newWestLng),
          new LatLng(newNorthLat, newEastLng)
        );
      }
    }
  }
}
