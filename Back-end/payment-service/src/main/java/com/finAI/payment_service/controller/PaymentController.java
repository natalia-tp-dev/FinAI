package com.finAI.payment_service.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finAI.payment_service.model.User;
import com.finAI.payment_service.repositories.UserRepository;
import com.finAI.payment_service.service.PaypalService;
import com.finAI.payment_service.service.UserDTO;
import com.finAI.payment_service.service.UserStatusDTO;

/**
 * REST controller responsible for handling payment-related operations.
 * <p>
 * This controller exposes endpoints for payment health checks and subscription
 * payment processing using PayPal.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*"
)
public class PaymentController {

    /**
     * Service responsible for interacting with PayPal APIs.
     */
    @Autowired
    private PaypalService paypalService;

    /**
     * Repository used to manage user persistence and subscription updates.
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Health check endpoint used to verify that the payment service is running
     * and accessible.
     *
     * @return HTTP 200 response indicating service availability
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok(
                "Servicio de Pagos en el puerto 8081: ACTIVO Y CONECTADO"
        );
    }

    @PostMapping("/initialize")
    public ResponseEntity<?> initializeUser(@RequestBody UserDTO registrationData) {
        try {
            UUID userUuid = UUID.fromString(registrationData.getId());

            if (userRepository.existsById(userUuid)) {
                return ResponseEntity.ok(Map.of("message", "User already initialized"));
            }

            User newUser = new User();
            newUser.setId(userUuid);

            newUser.setHas_selected_plan(false);
            newUser.setIs_in_trial(false);
            newUser.setPlan_type("FREE");
            newUser.setSubscriptionStatus("INACTIVE");

            userRepository.save(newUser);

            return ResponseEntity.status(201).body(Map.of("message", "User succesfully created at payment db"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error:", "Invalid ID format"));
        }
    }

    @PostMapping("/create-free-plan")
    public ResponseEntity<?> createFreePlan(@RequestBody UserDTO freePlanData) {
        try {
            UUID userUuid = UUID.fromString(freePlanData.getId());

            return userRepository.findById(userUuid)
                    .map(user -> {

                        user.setHas_selected_plan(true);
                        user.setPlan_type("FREE");
                        user.setSubscriptionStatus("INACTIVE");

                        userRepository.save(user);

                        return ResponseEntity.status(201).body(Map.of("message", "Free user plan successfully updated"));
                    })
                    .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error:", "Invalid ID format"));
        }
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getStatus(@PathVariable String id) {
        try {
            UUID userUuid = UUID.fromString(id);

            return userRepository.findById(userUuid)
                    .map(user -> {
                        UserStatusDTO dto = new UserStatusDTO(user);
                        return ResponseEntity.ok().body((Object) dto);
                    })
                    .orElseGet(() -> {
                        return ResponseEntity.status(404).body((Object) "User not found in payments");
                    });

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    /**
     * Processes a subscription payment after PayPal approval.
     * <p>
     * This endpoint:
     * <ul>
     * <li>Validates request data</li>
     * <li>Verifies the PayPal subscription</li>
     * <li>Updates the user's subscription and trial period</li>
     * </ul>
     *
     * @param request request body containing:
     * <ul>
     * <li>subscriptionId</li>
     * <li>userId</li>
     * <li>plan_type</li>
     * </ul>
     * @return HTTP response indicating the result of the payment processing
     */
    @PostMapping("/pay")
    public ResponseEntity<?> capturePayment(
            @RequestBody Map<String, String> request
    ) {

        String subscriptionId = request.get("subscriptionId");
        String userIdStr = request.get("userId");
        String planType = request.get("plan_type");

        System.out.println("DEBUG: Recibido subId=" + subscriptionId + " userId=" + userIdStr);

        try {
            UUID uuid = UUID.fromString(userIdStr);

            boolean isCaptured = paypalService.checkSubscription(subscriptionId);

            if (!isCaptured) {
                return ResponseEntity.status(400).body(
                        Map.of("error", "Paypal client error")
                );
            }

            return userRepository.findById(uuid)
                    .map(user -> {

                        user.setSubscription_id(subscriptionId);
                        user.setHas_selected_plan(true);
                        user.setPlan_type(planType);
                        user.setSubscriptionStatus("ACTIVE");
                        user.setIs_in_trial(true);
                        user.setTrial_start_date(LocalDateTime.now());
                        user.setTrial_end_date(LocalDateTime.now().plusDays(30));

                        userRepository.save(user);

                        return ResponseEntity.ok(
                                Map.of(
                                        "status", "Success",
                                        "message", "Payment captured, trial started"
                                )
                        );
                    })
                    .orElse(
                            ResponseEntity.status(404).body(
                                    Map.of("error", "User not found")
                            )
                    );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid UUID format")
            );
        }
    }
}
