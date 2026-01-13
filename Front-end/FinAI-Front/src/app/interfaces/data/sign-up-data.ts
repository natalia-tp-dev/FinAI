/**
 * Payload used for user sign-up requests.
 */
export interface SignUpData {

    /** User full name */
    full_name: string;

    /** User email address */
    email: string;

    /** User account password */
    password: string;
}
