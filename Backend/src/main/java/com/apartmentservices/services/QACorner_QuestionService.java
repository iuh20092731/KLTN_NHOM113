package com.apartmentservices.services;

import com.apartmentservices.dto.request.qacorner.QACornerQuestionCreationRequest;
import com.apartmentservices.dto.request.qacorner.QACornerQuestionUpdateRequest;
import com.apartmentservices.dto.response.UserResponse;
import com.apartmentservices.dto.response.qacorner.QACornerQuestionResponse;
import com.apartmentservices.dto.response.qacorner.CommentResponse;
import com.apartmentservices.dto.response.qacorner.QuestionResponse;
import com.apartmentservices.models.User;
import com.apartmentservices.models.qacorner.QACorner_Question;
import com.apartmentservices.models.qacorner.QACorner_Comment;
import com.apartmentservices.repositories.QACorner_QuestionRepository;
import com.apartmentservices.repositories.QACorner_CommentRepository;
import com.apartmentservices.mapper.QACornerQuestionMapper;
import com.apartmentservices.mapper.QACornerCommentMapper;
import com.apartmentservices.models.qacorner.QACorner_Question;
import com.apartmentservices.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QACorner_QuestionService {

    QACorner_QuestionRepository questionRepository;
    QACorner_CommentRepository commentRepository;
    UserRepository userRepository;
    QACornerQuestionMapper questionMapper;
    QACornerCommentMapper commentMapper;

    @Transactional
    public QACornerQuestionResponse createQuestion(QACornerQuestionCreationRequest request) {
        QACorner_Question question = request.getCreatedByUserId() == null
                ? questionMapper.toEntity_V2(request)
                : questionMapper.toEntity(request);

        // Gán user nếu có createdByUserId
        if (request.getCreatedByUserId() != null) {
            User user = userRepository.findById(request.getCreatedByUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            question.setUser(user);
        }

        // Lưu question vào database
        QACorner_Question savedQuestion = questionRepository.save(question);

        // Trả về response ánh xạ từ savedQuestion
        return questionMapper.toResponse(savedQuestion);
    }


    @Transactional(readOnly = true)
    public List<QACornerQuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QACornerQuestionResponse getQuestionById(Integer id) {
        QACorner_Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return questionMapper.toResponse(question);
    }

    @Transactional
    public QACornerQuestionResponse updateQuestion(Integer id, QACornerQuestionUpdateRequest request) {
        QACorner_Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        questionMapper.updateEntity(question, request);
        QACorner_Question updatedQuestion = questionRepository.save(question);
        return questionMapper.toResponse(updatedQuestion);
    }

    @Transactional
    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }


    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestionsWithComments(int page, int size) {
        // Lấy danh sách câu hỏi với paging
        Page<QACorner_Question> questions = questionRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));

        // Chuyển các question thành response kèm theo comment
        Page<QuestionResponse> questionResponses = questions.map(question -> {
            // Lấy các comment của từng câu hỏi
            List<CommentResponse> commentResponses = getCommentsForQuestion(question);

            // Kiểm tra nếu user của câu hỏi không phải là null
            User user = question.getUser();
            UserResponse userResponse = null;
            if (user != null) {
                userResponse = UserResponse.builder()
                        .id(user.getUserId())
                        .username(user.getUsername())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .avatar(user.getAvatar())
                        .roles(null)  // Nếu có trường roles
                        .build();
            }

            return new QuestionResponse(question.getQuestionId(), question.getContent(), question.getCreatedAt(), question.getLikes(), userResponse, commentResponses);
        });

        return questionResponses;
    }



    private List<CommentResponse> getCommentsForQuestion(QACorner_Question question) {
        // Lấy tất cả comment của question
        List<QACorner_Comment> comments = commentRepository.findByQuestion_QuestionIdOrderByCreatedAtAsc(question.getQuestionId());

        // In ra tất cả các comment vừa lấy
//        System.out.println("Comments for question ID " + question.getQuestionId() + ":");
//        for (QACorner_Comment comment : comments) {
//            System.out.println("Comment ID: " + comment.getCommentId());
//            System.out.println("Content: " + comment.getContent());
//            System.out.println("Parent ID: " + (comment.getParentComment() != null ? comment.getParentComment().getCommentId() : "null"));
//            System.out.println("Created Date: " + comment.getCreatedAt());
//            System.out.println("User ID: " + (comment.getUser() != null ? comment.getUser().getUserId() : "null")); // In ra User ID
//        }

        List<CommentResponse> commentResponses = new ArrayList<>();
        Map<Integer, CommentResponse> commentMap = new HashMap<>();
        Set<Integer> addedReplies = new HashSet<>(); // Set để theo dõi các commentId của reply đã thêm vào

        // Duyệt qua các comment và tạo cấu trúc cha-con
        for (QACorner_Comment comment : comments) {
            CommentResponse commentResponse = commentMapper.toResponse_V2(comment);

            // Kiểm tra nếu User không phải là null và ánh xạ User vào CommentResponse
            if (comment.getUser() != null) {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(comment.getUser().getUserId());
                userResponse.setUsername(comment.getUser().getUsername());
                commentResponse.setUser(userResponse); // Thêm user vào commentResponse
            }

            commentMap.put(comment.getCommentId(), commentResponse);

            // Kiểm tra nếu là comment cha hay con
            if (comment.getParentComment() != null) {
                // Nếu có comment cha (parent), kiểm tra xem reply này đã tồn tại chưa
                CommentResponse parentResponse = commentMap.get(comment.getParentComment().getCommentId());
                if (parentResponse != null) {
                    // Kiểm tra nếu reply này đã tồn tại trong replies của parentResponse
                    if (!addedReplies.contains(comment.getCommentId())) {
                        // Kiểm tra xem comment đã có trong replies của parent chưa
                        boolean alreadyAdded = parentResponse.getReplies().stream()
                                .anyMatch(reply -> reply.getCommentId().equals(comment.getCommentId()));
                        if (!alreadyAdded) {
                            parentResponse.getReplies().add(commentResponse);
                            addedReplies.add(comment.getCommentId()); // Thêm commentId vào Set để tránh trùng lặp
                        }
                    }
                }
            } else {
                // Nếu là comment gốc (không có parent), thêm vào list comment
                commentResponses.add(commentResponse);
            }
        }

        return commentResponses;
    }

    @Transactional
    public void increaseLikes(Integer questionId) {
        // Tìm question dựa trên questionId
        QACorner_Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Tăng giá trị likes
        question.setLikes(question.getLikes() + 1);

        // Lưu lại question đã cập nhật
        questionRepository.save(question);
    }


}
