package com.finAI.payment_service.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finAI.payment_service.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    List <User> findAllByPlanTypeAndTrialEndDateBefore(String planType, LocalDateTime dateTime);
    List <User> findAllByPlanTypeNot(String planType);
}
