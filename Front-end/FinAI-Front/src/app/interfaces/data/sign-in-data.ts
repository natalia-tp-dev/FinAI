/**
 * Payload used for user sign-in requests.
 */
export interface SignInData {

    /** User email address */
    email: string;

    /** User account password */
    password: string;
}
