package com.apartmentservices.repositories;

import com.apartmentservices.models.AdvertisementMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvertisementMediaRepository extends JpaRepository<AdvertisementMedia, Integer> {
    @Query(value = "SELECT * FROM advertisement_media WHERE advertisement_id = :advertisementId", nativeQuery = true)
    List<AdvertisementMedia> findAllByAdvertisementId(Integer advertisementId);

    @Query(value = "SELECT * FROM advertisement_media WHERE advertisement_id = :advertisementId AND type = :type", nativeQuery = true)
    List<AdvertisementMedia> findAllByAdvertisementIdAndType(Integer advertisementId, AdvertisementMedia.MediaType type);

    // Lấy tất cả media của một quảng cáo
    List<AdvertisementMedia> findByAdvertisement_AdvertisementId(Integer advertisementId);

    // Lấy tất cả media của một quảng cáo theo loại media
    List<AdvertisementMedia> findByAdvertisement_AdvertisementIdAndType(Integer advertisementId, AdvertisementMedia.MediaType type);

    @Query("SELECT a FROM AdvertisementMedia a WHERE a.type = :type AND a.advertisement.adStatus = 'Active' ORDER BY a.createdDate DESC")
    List<AdvertisementMedia> findTop5ByTypeOrderByCreatedDateDesc(@Param("type") AdvertisementMedia.MediaType type);

}
