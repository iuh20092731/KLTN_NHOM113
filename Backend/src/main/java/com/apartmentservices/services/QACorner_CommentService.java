package com.apartmentservices.services;

import com.apartmentservices.dto.request.qacorner.QACornerCommentCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerCommentUpdateRequest;
import com.apartmentservices.dto.response.qacorner.QACornerCommentResponse;
import com.apartmentservices.mapper.QACornerCommentMapper;
import com.apartmentservices.models.User;
import com.apartmentservices.models.qacorner.QACorner_Comment;
import com.apartmentservices.repositories.QACorner_CommentRepository;
import com.apartmentservices.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QACorner_CommentService {

    UserRepository userRepository;
    QACorner_CommentRepository commentRepository;
    QACornerCommentMapper commentMapper;

    @Transactional
    public QACornerCommentResponse createComment(QACornerCommentCreationRequest request) {
        QACorner_Comment comment = request.getCreatedByUserId() == null
                ? commentMapper.toQACornerComment_V2(request)
                : commentMapper.toQACornerComment(request);

        // Kiểm tra nếu createdByUserId có tồn tại trong request, nếu có, tìm kiếm User và gán vào comment
        if (request.getCreatedByUserId() != null) {
            User user = userRepository.findById(request.getCreatedByUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            comment.setUser(user);
        }

        // Lưu comment vào database
        QACorner_Comment savedComment = commentRepository.save(comment);

        // Trả về response ánh xạ từ savedComment
        return commentMapper.toResponse(savedComment);
    }




    @Transactional
    public QACornerCommentResponse createReply(Integer commentId, QACornerCommentCreationRequest request) throws Exception {
        System.out.println("Creating reply for comment with ID " + commentId);

        // Tìm comment gốc mà bạn sẽ trả lời
        QACorner_Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new Exception("Comment with ID " + commentId + " not found"));

        // Tạo comment mới với parent comment là comment gốc
        QACorner_Comment reply = request.getCreatedByUserId() == null
                ? commentMapper.toQACornerComment_V2(request)
                : commentMapper.toQACornerComment(request);

        reply.setParentComment(parentComment); // Gán comment gốc là parent

        // Lưu comment trả lời và trả về phản hồi
        QACorner_Comment savedReply = commentRepository.save(reply);

        // Trả về response ánh xạ từ savedReply
        return commentMapper.toResponse(savedReply);
    }



    @Transactional(readOnly = true)
    public List<QACornerCommentResponse> getAllComments() {
        List<QACorner_Comment> comments = commentRepository.findAll();
        return comments.stream()
                .map(commentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public QACornerCommentResponse getCommentById(Integer id) {
        QACorner_Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return commentMapper.toResponse(comment);
    }

    @Transactional
    public QACornerCommentResponse updateComment(Integer id, QACornerCommentUpdateRequest request) {
        QACorner_Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentMapper.updateQACornerComment(existingComment, request);
        QACorner_Comment updatedComment = commentRepository.save(existingComment);
        return commentMapper.toResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Integer id) {
        // Tìm comment cha
        QACorner_Comment parentComment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Kiểm tra nếu comment có comment con (replies)
        if (parentComment.getReplies() != null && !parentComment.getReplies().isEmpty()) {
            // Nếu có comment con, xóa tất cả comment con
            commentRepository.deleteAll(parentComment.getReplies());  // Xóa tất cả comment con
        }

        // Cập nhật các comment con, thiết lập lại parent_commentid thành null (nếu cần thiết)
        if (parentComment.getReplies() != null) {
            for (QACorner_Comment reply : parentComment.getReplies()) {
                reply.setParentComment(null);  // Đặt parent_commentid = null
            }
        }

        // Sau khi xóa các comment con (nếu có), xóa comment cha
        commentRepository.delete(parentComment);  // Xóa comment cha
    }

    @Transactional
    public void deleteCommentsByQuestionId(Integer questionId) {
        // Tìm tất cả các comment thuộc câu hỏi với questionId
        List<QACorner_Comment> comments = commentRepository.findByQuestion_QuestionId(questionId);

        // Xóa tất cả comment của câu hỏi đó
        commentRepository.deleteAll(comments);
    }


}
