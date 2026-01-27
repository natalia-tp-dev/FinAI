package com.finAI.payment_service.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.finAI.payment_service.model.User;

public class UserStatusDTO {
    @JsonProperty("plan_type")
    private String planType;

    @JsonProperty("has_selected_plan")
    private boolean  hasSelectedPlan;

    @JsonProperty("is_in_trial")
    private boolean isInTrial;

    @JsonProperty("subscription_status")
    private String subscriptionStatus;

    public UserStatusDTO(User user) {
        this.planType = user.getPlanType() != null ? user.getPlanType(): "FREE";
        this.hasSelectedPlan = user.isHasSelectedPlan();
        this.isInTrial = user.isInTrial();
        this.subscriptionStatus = user.getSubscriptionStatus();
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public boolean isHasSelectedPlan() {
        return hasSelectedPlan;
    }

    public void setHasSelectedPlan(boolean hasSelectedPlan) {
        this.hasSelectedPlan = hasSelectedPlan;
    }

    public boolean isIsInTrial() {
        return isInTrial;
    }

    public void setIsInTrial(boolean isInTrial) {
        this.isInTrial = isInTrial;
    }

    public String getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public void setSubscriptionStatus(String subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }


}
