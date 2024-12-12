package com.apartmentservices.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.apartmentservices.constant.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    List<User> findByIsActiveAndUserTypeAndFirstNameContainingIgnoreCaseOrIsActiveAndUserTypeAndLastNameContainingIgnoreCaseOrIsActiveAndUserTypeAndUsernameContainingIgnoreCaseOrIsActiveAndUserTypeAndUserId(
            boolean isActive1, UserType userType1, String firstName,
            boolean isActive2, UserType userType2, String lastName,
            boolean isActive3, UserType userType3, String username,
            boolean isActive4, UserType userType4, String userId);

    List<User> findByIsActiveAndFirstNameContainingIgnoreCaseOrIsActiveAndLastNameContainingIgnoreCaseOrIsActiveAndUsernameContainingIgnoreCaseOrIsActiveAndUserId(
            boolean isActive1, String firstName,
            boolean isActive2, String lastName,
            boolean isActive3, String username,
            boolean isActive4, String userId);


    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByIsActiveAndUserType(Boolean isActive, UserType userType);

    List<User> findAll(); // Lấy tất cả người dùng

    List<User> findByIsActive(Boolean isActive); // Lọc theo isActive

    List<User> findByUserType(UserType userType); // Lọc theo userType

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.createdAt BETWEEN :startDate AND :endDate")
    Long countActiveUsersByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Truy vấn lấy các user mới nhất với phân trang
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    Page<User> findTopNewUsers(Pageable pageable);
}
