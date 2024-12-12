package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.ActivityLog;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
    // Thêm các phương thức tùy chỉnh nếu cần
}
