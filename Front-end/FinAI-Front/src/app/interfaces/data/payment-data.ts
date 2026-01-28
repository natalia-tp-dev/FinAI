/**
 * Represents subscription payment information.
 */
export interface PaymentData {

    /** Unique subscription identifier */
    subscriptionId: string;

    /** Type of subscription plan */
    plan_type: string;
}
