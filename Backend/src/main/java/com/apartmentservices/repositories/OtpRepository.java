package com.apartmentservices.repositories;

import com.apartmentservices.models.Otp;
import com.apartmentservices.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> {
    Optional<Otp> findByUser(User user);
}
