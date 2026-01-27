/**
 * Represents subscription payment information.
 */
export interface PaymentData {

    /** Unique subscription identifier */
    subscriptionId: string;

    /** Identifier of the user who owns the subscription */
    userId: string;

    /** Type of subscription plan */
    plan_type: string;
}
