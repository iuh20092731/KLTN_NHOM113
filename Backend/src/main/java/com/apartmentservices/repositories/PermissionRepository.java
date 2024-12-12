package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}
