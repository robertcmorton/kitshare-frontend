/**
 * this is  model for user registration daa
 */
export class UserRegistrationData {
  /**
   * Contain user's email id
   */
  public primary_email_address: string;

  /**
   * Contain users first name
   */
  public app_user_first_name: string;

  /**
   * Contain users last name
   */
  public app_user_last_name: string;

  /**
   * contains user's password
   */
  public app_password: string;
}

/**
 * this is model for login credentials
 */
export class UserLoginData {
  /**
   * this will contain users email address
   */
  public primary_email_address: string;

  /**
   * this will contain users password
   */
  public app_password: string;

  public keep_me_signed_in: number = 0;
}

/**
 * this is model for login api response
 */
export class LoginResponse {
  /**
   * api responsee status
   */
  public status: number;

  /**
   * api response message
   */
  public status_message: string;

  /**
   * contain users auth
   */
  public auth_token?: string;
}
/**
 * this is model for api response
 */
export class HttpResonseTextWihStatus {
  /**
   * api responsee status
   */
  public status: number;

  /**
   * api response message
   */
  public status_message: string;
}

/**
 * this is a data model for social login
 */
export class SocialLoginData {
  /**
   * contain logged in user's name
   */
  public name: string = "";

  /**
   * contain logged in users email
   */
  public email: string = "";

  /**
   * contain logged in user's auth provider is
   */
  public id: any = "";

  /**
   * contain profile image path
   */
  public image: string = "";
}

/**
 * this is a model for reset password
 */
export class ResetPasswordData {
  /**
   * this will contain new password
   *
   * @var string
   */
  public newpassword: string;

  /**
   * this will contain confirm password
   */
  public confirmpassword: string;

  public token: string;
}

/**
 * contain loggedd in user data
 */
export class UserData {
  /**
   * logged in user name
   */
  public name: string;

  /**
   * logged in user email
   */
  public email: string;

  /**
   * logged in user auth token
   */
  public auth_token: string;
}
export class UserDetailsResponse extends HttpResonseTextWihStatus {
  /**
   * contain respective user's name
   */
  public name?: string;

  /**
   * contain user's email
   */
  public email?: string;

  public auth_token?: string;
}
