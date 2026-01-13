package com.finAI.payment_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.finAI.payment_service.model.User;
import com.finAI.payment_service.repositories.UserRepository;

/**
 * Scheduler responsible for validating user subscription and trial states.
 * <p>
 * This component runs scheduled background jobs to:
 * <ul>
 *   <li>Deactivate expired trial accounts</li>
 *   <li>Validate active subscriptions against PayPal</li>
 * </ul>
 */
@Component
public class SubscriptionScheduler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaypalService paypalService;

    /**
     * Deactivates users whose trial period has expired.
     * <p>
     * This task runs every day at midnight and:
     * <ul>
     *   <li>Marks the subscription as expired</li>
     *   <li>Removes trial status</li>
     *   <li>Downgrades the user to FREE plan</li>
     * </ul>
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void deactivateExpiredTrials() {

        LocalDateTime now = LocalDateTime.now();

        List<User> expiredUsers =
            userRepository.findAllByPlanTypeAndTrialEndDateBefore("trial", now);

        for (User user : expiredUsers) {
            user.setSubscriptionStatus("EXPIRED");
            user.setIs_in_trial(false);
            user.setPlan_type("FREE");
            user.setHas_selected_plan(false);

            System.out.println("Trial expired for user " + user.getId());
            userRepository.save(user);
        }
    }

    /**
     * Validates active user subscriptions with PayPal.
     * <p>
     * This task runs every day at midnight and:
     * <ul>
     *   <li>Checks PayPal subscription status</li>
     *   <li>Expires accounts with inactive subscriptions</li>
     *   <li>Downgrades users to FREE plan if payment is not valid</li>
     * </ul>
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void deactivateExpiredAccounts() {

        List<User> activeUsers =
            userRepository.findAllByPlanTypeNot("FREE");

        for (User user : activeUsers) {

            if (user.getSubscription_id() == null) {
                continue;
            }

            boolean isActive =
                paypalService.checkSubscription(user.getSubscription_id());

            if (!isActive) {
                user.setSubscriptionStatus("EXPIRED");
                user.setIs_in_trial(false);
                user.setPlan_type("FREE");
                user.setHas_selected_plan(false);

                System.out.println("Account expired for user " + user.getId());
                userRepository.save(user);
            }
        }
    }
}
