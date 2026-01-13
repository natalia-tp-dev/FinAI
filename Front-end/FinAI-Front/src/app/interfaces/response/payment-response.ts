/**
 * Represents a generic payment operation response.
 */
export interface PaymentResponse {

    /** Result status of the payment process */
    status: string;

    /** Informational or error message returned by the server */
    message: string;
}
