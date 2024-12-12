package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {}
