export class Coords {
  constructor(public lat: number, public lng: number){}
}

export class KSAddress {
  constructor(
    public street_address_line2: string,
    public route: string,
    public suburb_name: string,
    public ks_state_name: string,
    public ks_country_name: string,
    public postcode: number,
    public lat: number,
    public lng: number,
    public administrative_area_level_2?: string,
    public user_address_id?: number,
    public is_default?: boolean,
    ) {}
}

// public route: string,
//     public ks_state_id: string,
//     public ks_country_id: string,
//     public postcode: number,
//     public coords: Coords,

//     public street_address_line1?: string,
//     public ks_suburb_id?: string,
//     public administrive_area_level_2?: string,
