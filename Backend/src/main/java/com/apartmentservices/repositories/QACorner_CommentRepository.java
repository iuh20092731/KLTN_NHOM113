package com.apartmentservices.repositories;

import com.apartmentservices.models.qacorner.QACorner_Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface QACorner_CommentRepository extends JpaRepository<QACorner_Comment, Integer> {
    List<QACorner_Comment> findByQuestion_QuestionId(Integer questionId);

    List<QACorner_Comment> findByQuestion_QuestionIdOrderByCreatedAtAsc(Integer questionId);

    @Query("SELECT c FROM QACorner_Comment c LEFT JOIN FETCH c.replies WHERE c.id = :id")
    Optional<QACorner_Comment> findByIdWithReplies(@Param("id") Integer id);

}
