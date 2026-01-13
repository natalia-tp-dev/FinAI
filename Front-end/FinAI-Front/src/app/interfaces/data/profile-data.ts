/**
 * Represents authenticated user profile data.
 */
export interface ProfileData {

    /** Unique user identifier */
    id: string;

    /** User full name */
    full_name: string;

    /** User email address */
    email: string;

    /** Current subscription plan type */
    plan_type: string;

    /** Indicates whether the user has selected a plan */
    has_selected_plan: boolean;

    /** Indicates whether the user is currently in a trial period */
    is_in_trial: boolean;

    /** Current subscription status */
    subscription_status: string;

    /** Indicates whether the user is authenticated */
    isLogged: boolean;
}
