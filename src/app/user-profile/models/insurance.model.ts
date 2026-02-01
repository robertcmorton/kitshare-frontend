export class Insurance {
  constructor(
    public is_active: boolean,
    public insurance_id: string,
    public policy_name: string,
    public start_date: string,
    public expiry_date: string,
    public renters_insurance: {amount: string, status: boolean},
    public owners_insurance: {amount: string, status: boolean},
    public insurance_image_link: string
    ) {}
}
