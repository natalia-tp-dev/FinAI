package com.finAI.payment_service.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Represents a user entity related to payment and subscription management.
 * <p>
 * This entity stores subscription state, trial period information,
 * and payment-related identifiers used by the payment service.
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * Unique identifier of the user.
     * Stored as a binary UUID for optimized database storage.
     */
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    /**
     * Current subscription status of the user.
     * Possible values: ACTIVE, EXPIRED, CANCELLED.
     */
    @Column(
        name = "subscription_status",
        columnDefinition = "ENUM('ACTIVE', 'EXPIRED', 'CANCELLED')"
    )
    private String subscriptionStatus;

    /**
     * Type of subscription plan selected by the user.
     * Example: BASIC, PRO, PREMIUM.
     */
    @Column(name = "plan_type")
    private String planType;

    /**
     * Start date of the user's trial period.
     */
    @Column(name = "trial_start_date")
    private LocalDateTime trialStartDate;

    /**
     * End date of the user's trial period.
     */
    @Column(name = "trial_end_date")
    private LocalDateTime trialEndDate;

    /**
     * Indicates whether the user has selected a subscription plan.
     */
    @Column(name = "has_selected_plan")
    private boolean hasSelectedPlan;

    /**
     * Indicates whether the user is currently in a trial period.
     */
    @Column(name = "is_in_trial")
    private boolean isInTrial;

    /**
     * External subscription identifier provided by the payment provider.
     */
    @Column(name = "subscription_id")
    private String subscriptionId;

    /**
     * Returns the unique identifier of the user.
     */
    public UUID getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the user.
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * Returns the subscription plan type.
     */
    public String getPlanType() {
        return planType;
    }

    /**
     * Sets the subscription plan type.
     */
    public void setPlan_type(String planType) {
        this.planType = planType;
    }

    /**
     * Returns the start date of the trial period.
     */
    public LocalDateTime getTrial_start_date() {
        return trialStartDate;
    }

    /**
     * Sets the start date of the trial period.
     */
    public void setTrial_start_date(LocalDateTime trialStartDate) {
        this.trialStartDate = trialStartDate;
    }

    /**
     * Returns the end date of the trial period.
     */
    public LocalDateTime getTrial_end_date() {
        return trialEndDate;
    }

    /**
     * Sets the end date of the trial period.
     */
    public void setTrial_end_date(LocalDateTime trialEndDate) {
        this.trialEndDate = trialEndDate;
    }

    /**
     * Indicates whether the user has selected a plan.
     */
    public boolean isHasSelectedPlan() {
        return hasSelectedPlan;
    }

    /**
     * Sets whether the user has selected a plan.
     */
    public void setHas_selected_plan(boolean hasSelectedPlan) {
        this.hasSelectedPlan = hasSelectedPlan;
    }

    /**
     * Indicates whether the user is currently in a trial.
     */
    public boolean isInTrial() {
        return isInTrial;
    }

    /**
     * Sets whether the user is currently in a trial.
     */
    public void setIs_in_trial(boolean isInTrial) {
        this.isInTrial = isInTrial;
    }

    /**
     * Returns the external subscription identifier.
     */
    public String getSubscription_id() {
        return subscriptionId;
    }

    /**
     * Sets the external subscription identifier.
     */
    public void setSubscription_id(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    /**
     * Returns the current subscription status.
     */
    public String getSubscriptionStatus() {
        return subscriptionStatus;
    }

    /**
     * Sets the current subscription status.
     */
    public void setSubscriptionStatus(String subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }
}
