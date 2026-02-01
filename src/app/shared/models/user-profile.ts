export class UserProfileData {
  app_user_first_name: string;
  app_user_last_name: string;
  user_description: string;
  user_profile_picture_link: any;
  imdb_link: string;
  showreel_link: string;
  instagram_link: string;
  facebook_link: string;
  vimeo_link: string;
  flikr_link: string;
  twitter_link: string;
  linkedin_link: string;
  app_user_id: string;
  create_date: string;
  profession_name: string;
  user_website: string;
  youtube_link: string;
}

export class UserEditProfileData extends UserProfileData {
  app_username: string;
  app_business_name: string;
  australian_business_number: string;
  primary_email_address: string;
  primary_mobile_number: string;
  user_birth_date: string;
  ks_renter_type_id: string;
  profession_type_id: string;
  other_profession: string;
  youtube_link: string;
  website_link: string;
  registered_for_gst: string;
  show_business_name: string = 'N';
}

export class RentalTypeOption {
  ks_renter_type_id: string;
  ks_renter_type: string;
}

export class ProfessionTypeOption {
  profession_type_id: string;
  profession_name: string;
}
