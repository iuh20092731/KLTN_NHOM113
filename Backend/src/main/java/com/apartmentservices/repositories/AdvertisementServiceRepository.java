package com.apartmentservices.repositories;

import com.apartmentservices.models.AdvertisementService;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Primary
@Repository
public interface AdvertisementServiceRepository extends JpaRepository<AdvertisementService, Integer> {
    // Method to find advertisement services by category ID
    List<AdvertisementService> findByCategory_CategoryId(Integer categoryId);

    @Query(value = "SELECT aservice.* " +
            "FROM advertisement_services aservice " +
            "JOIN categories category ON aservice.CategoryID = category.category_id " +
            "WHERE LOWER(category.category_name_no_diacritics) LIKE LOWER(:categoryName)",
            nativeQuery = true)
    List<AdvertisementService> findByCategory_CategoryNameContainingIgnoreCase(@Param("categoryName") String categoryName);

    // Tìm kiếm theo serviceNameNoDiacritics
    @Query("SELECT a FROM AdvertisementService a WHERE LOWER(a.serviceNameNoDiacritics) = LOWER(:serviceName)")
    Optional<AdvertisementService> findByServiceNameNoDiacritics(@Param("serviceName") String serviceNameNoDiacritics);

    @Query("SELECT s FROM AdvertisementService s WHERE " +
            "LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.serviceNameNoDiacritics) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<AdvertisementService> searchByKeyword(String keyword);
}
