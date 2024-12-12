package com.apartmentservices.repositories;

import com.apartmentservices.models.FavoriteAdvertisement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteAdvertisementRepository extends JpaRepository<FavoriteAdvertisement, Integer> {
    List<FavoriteAdvertisement> findByStatus(FavoriteAdvertisement.FavoriteStatus status);
    List<FavoriteAdvertisement> findByServiceId(Integer serviceId);

//    List<FavoriteAdvertisement> findAllByOrderBySeqAsc(Pageable pageable);

    Page<FavoriteAdvertisement> findAllByOrderBySeqAsc(Pageable pageable);

    List<FavoriteAdvertisement> findByAdvertisementId(Integer advertisementId);

    @Query("SELECT MAX(f.seq) FROM FavoriteAdvertisement f")
    Optional<Integer> findMaxSeq();

}
