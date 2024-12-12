package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.AdvertisementServiceMedia;

import java.util.List;

@Repository
public interface AdvertisementServiceMediaRepository extends JpaRepository<AdvertisementServiceMedia, Integer> {
    @Query(value = "SELECT A.* FROM service_media A " +
            "LEFT JOIN advertisement_services B ON A.serviceId = B.service_id " +
            "WHERE A.serviceId = :serviceId", nativeQuery = true)
    List<AdvertisementServiceMedia> findByServiceId(Integer serviceId);
}
