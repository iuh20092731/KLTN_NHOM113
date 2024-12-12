package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.ActiveUser;

@Repository
public interface ActiveUserRepository extends JpaRepository<ActiveUser, Integer> {
}
