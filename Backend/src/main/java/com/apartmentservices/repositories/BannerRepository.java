package com.apartmentservices.repositories;

import com.apartmentservices.constant.BannerType;
import com.apartmentservices.models.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BannerRepository extends JpaRepository<Banner, Integer> {

    @Query("SELECT b FROM Banner b WHERE b.type = :type")
    List<Banner> findByType(@Param("type") String type);

    @Query("SELECT MAX(b.seq) FROM Banner b")
    Integer findMaxSeq();

    List<Banner> findByType(BannerType type);

    Optional<Banner> findByAdvertisementId(Integer advertisementId);

    List<Banner> findBySeq(int seq);

    List<Banner> findByTypeAndSeq(BannerType type, int seq);

    @Query("SELECT MAX(b.serial) FROM Banner b WHERE b.seq = :seq")
    Integer findMaxSerialBySeq(@Param("seq") int seq);

    @Query(value = "SELECT * FROM banners b WHERE b.type = :type AND b.seq = :seq ORDER BY b.serial ", nativeQuery = true)
    List<Banner> findByTypeAndSeqOrderBySeqAndSerial(@Param("type") String type, @Param("seq") int seq);


    @Query(value = "SELECT * FROM banners WHERE type = :type ORDER BY seq ASC, serial ASC", nativeQuery = true)
    List<Banner> findBannersByTypeOrderBySeqAndSerial(@Param("type") String type);

    @Query("SELECT b FROM Banner b WHERE b.seq = :seq AND b.type = :type ORDER BY b.serial DESC")
    Banner findBannerWithMaxSerialBySeq(@Param("seq") int seq, @Param("type") BannerType type);

    @Query("SELECT DISTINCT b.seq FROM Banner b WHERE b.type = :type")
    List<Integer> findDistinctSeqForType(@Param("type") BannerType type);

    @Query("SELECT b FROM Banner b WHERE b.type = 'RIGHT' AND (b.seq, b.serial) IN " +
            "(SELECT b2.seq, MAX(b2.serial) FROM Banner b2 WHERE b2.type = 'RIGHT' GROUP BY b2.seq) " +
            "ORDER BY b.seq")
    List<Banner> findAllRightBannersWithMaxSerial();





}
