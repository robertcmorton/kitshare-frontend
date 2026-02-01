import { ContactInfoData } from "./contact-info";

export class GearList {
  public gearName = "";
  public gear_category_name = "";
  public gear_sub_category_name = "";
  public gear_brand_name = "";
  public gear_model_name = "";
  public gearAdditionalNotes = "";
  public model_description = "";
  public additional_description = "";
  public per_day_cost_aud_inc_gst = "";
  public per_day_cost_aud_ex_gst = "";
  public replacement_value_aud_ex_gst = "";
  public replacement_value_aud_inc_gst = "";
  public security_deposite = "";
  public gearCondition = "";
  public extraItems = [new ExtraItems()];
  public is_kit = false;
  public address = [];
  public listing_option = "listed";
  public serialNumber = "";
  public gearTypeId = "";
  public image360Link = "";
  public unAvailableDates = [];
  public feature_master_id = [];
  public feature_details_id = [];
  public security_deposit_check = '0';
  public model_image_deleted = 0;
}
export class UpdateGearList {
  public user_gear_desc_id = "";
  public gearName = "";
  public gear_category_name = "";
  public gear_sub_category_name = "";
  public gear_brand_name = "";
  public gear_model_name = "";
  public gearAdditionalNotes = "";
  public model_description = "";
  public additional_description = "";
  public per_day_cost_aud_ex_gst = "";
  public replacement_value_aud_inc_gst = "";
  public replacement_value_aud_ex_gst = "";
  public security_deposite = "";
  public gearCondition = "Old";
  public extraItems = [new ExtraItems()];
  public is_kit = false;
  public address = [];
  public listing_option = "listed";
  public serialNumber = "";
  public gearTypeId = "";
  public image360Link = "";
  public unAvailableDates = [];
  public feature_master_id = [];
  public feature_details_id = [];
  public ks_gear_feature_details = [];
  public per_day_cost_aud_inc_gst = "";
  public security_deposit_check = '0';
  public model_image_deleted = 0;
}
export class Address {
  public street_address_line1 = "";
  public street_address_line2 = "";
  public ks_state_id = "";
  public ks_suburb_id = "";
  public postcode = "";
  public is_default = false;
}
export class ExtraItems {
  item: "";
  serial: "";
}
