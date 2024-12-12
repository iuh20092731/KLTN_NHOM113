package com.apartmentservices.repositories;

import com.apartmentservices.models.qacorner.QACorner_Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface QACorner_QuestionRepository extends JpaRepository<QACorner_Question, Integer> {
    Page<QACorner_Question> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
