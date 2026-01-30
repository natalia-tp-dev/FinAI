package com.finAI.payment_service.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Service responsible for interacting with the PayPal API.
 * <p>
 * This service handles:
 * <ul>
 * <li>OAuth authentication with PayPal</li>
 * <li>Subscription status validation</li>
 * </ul>
 */
@Service
public class PaypalService {

    /**
     * PayPal client ID injected from application properties.
     */
    @Value("${paypal.client.id}")
    private String clientId;

    /**
     * PayPal client secret injected from application properties.
     */
    @Value("${paypal.secret}")
    private String paypalSecret;

    /**
     * Base URL for the PayPal Sandbox API.
     */
    @Value("${paypal.url:https://api-m.sandbox.paypal.com}")
    private String paypalURL;

    /**
     * Requests an OAuth access token from PayPal.
     * <p>
     * The token is required to authenticate subsequent API calls.
     *
     * @return a valid PayPal access token
     * @throws RuntimeException if the token cannot be retrieved
     */
    private String getAccessToken() {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, paypalSecret);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request
                = new HttpEntity<>(formData, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                paypalURL + "/v1/oauth2/token",
                request,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }

    /**
     * Validates the status of a PayPal subscription.
     * <p>
     * A subscription is considered valid if its status is {@code ACTIVE} or
     * {@code APPROVED}.
     *
     * @param subscriptionId PayPal subscription identifier
     * @return {@code true} if the subscription is valid, otherwise
     * {@code false}
     */
    public boolean checkSubscription(String subscriptionId) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            System.out.println(getAccessToken());
            headers.setBearerAuth(getAccessToken());

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    paypalURL + "/v1/billing/subscriptions/" + subscriptionId,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            System.out.println("Status recibido de PayPal para " + subscriptionId + ": " + response.getBody().get("status"));

            String status = (String) response.getBody().get("status");

            return "ACTIVE".equals(status) || "APPROVED".equals(status);

        } catch (Exception e) {
            return false;
        }
    }
}
