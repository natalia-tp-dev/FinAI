package com.finAI.payment_service.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finAI.payment_service.repositories.UserRepository;
import com.finAI.payment_service.service.PaypalService;

/**
 * REST controller responsible for handling payment-related operations.
 * <p>
 * This controller exposes endpoints for payment health checks and
 * subscription payment processing using PayPal.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
    origins = "http://localhost:4200",
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
     * Health check endpoint used to verify that the payment service
     * is running and accessible.
     *
     * @return HTTP 200 response indicating service availability
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok(
            "Servicio de Pagos en el puerto 8081: ACTIVO Y CONECTADO"
        );
    }

    /**
     * Processes a subscription payment after PayPal approval.
     * <p>
     * This endpoint:
     * <ul>
     *   <li>Validates request data</li>
     *   <li>Verifies the PayPal subscription</li>
     *   <li>Updates the user's subscription and trial period</li>
     * </ul>
     *
     * @param request request body containing:
     *                <ul>
     *                  <li>subscriptionId</li>
     *                  <li>userId</li>
     *                  <li>plan_type</li>
     *                </ul>
     * @return HTTP response indicating the result of the payment processing
     */
    @PostMapping("/pay")
    public ResponseEntity<?> capturePayment(
        @RequestBody Map<String, String> request
    ) {

        String subscriptionId = request.get("subscriptionId");
        String userIdStr = request.get("userId");
        String planType = request.get("plan_type");

        if (subscriptionId == null || userIdStr == null || planType == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Missing data")
            );
        }

        boolean isCaptured = paypalService.checkSubscription(subscriptionId);

        if (!isCaptured) {
            return ResponseEntity.status(400).body(
                Map.of("error", "Paypal client error")
            );
        }

        try {
            UUID uuid = UUID.fromString(userIdStr);
            return userRepository.findById(uuid)
                .map(user -> {

                    user.setSubscription_id(subscriptionId);
                    user.setHas_selected_plan(true);
                    user.setPlan_type(planType);

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
