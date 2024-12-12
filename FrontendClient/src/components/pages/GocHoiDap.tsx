import { AppDispatch, RootState } from '@/redux/store';
import { getQuestions, likeQuestion, postComment, postQuestion, postReply } from '@/redux/thunks/question';
import React, { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';

const QnAPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.question.data?.content);
  const totalQuestions = useSelector((state: RootState) => state.question.data?.totalElements);

  const [questionCount, setQuestionCount] = useState(2);

  useEffect(() => {
    dispatch(getQuestions({ page: 0, size: questionCount }));
  }, [questionCount]);

  const handleLoadMore = () => {
    setQuestionCount((prevCount) => prevCount + 5);
  };

  const [questionInput, setQuestionInput] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});


  const currentDate = new Date();
  const offset = 7;
  const localTime = new Date(currentDate.getTime() + offset * 60 * 60 * 1000).toISOString();

  const handleAddQuestion = async () => {
    try {
      await dispatch(postQuestion({ content: questionInput, createdByUserId: null, createDate: localTime }));
      message.success('Câu hỏi đã được đăng thành công!');
      setQuestionInput('');
      dispatch(getQuestions({ page: 0, size: questionCount }));
    } catch (error) {
      message.error('Đăng câu hỏi thất bại!');
    }
  };

  const handleAddComment = async (questionId: number) => {
    try {
      
      await dispatch(postComment({ commentText: commentInputs[questionId] || '', questionId, createDate: localTime }));
      message.success('Bình luận thành công!');
      setCommentInputs({ ...commentInputs, [questionId]: '' });
      dispatch(getQuestions({ page: 0, size: questionCount })); // Tải lại danh sách câu hỏi
    } catch (error) {
      message.error('Bình luận thất bại!');
    }
  };

  const handleAddReply = async (questionId: number, idComment: number) => {
    try {
      await dispatch(
        postReply({
          commentText: replyInputs[idComment] || '',
          questionId,
          createdByUserId: null,
          id: idComment,
          createDate: localTime
        })
      );
      message.success('Phản hồi thành công!');
      setReplyInputs((prev) => ({
        ...prev,
        [idComment]: '',
      }));
      dispatch(getQuestions({ page: 0, size: questionCount })); // Tải lại danh sách câu hỏi
    } catch (error) {
      message.error('Phản hồi thất bại!');
    }
  };

  const toggleComments = (questionId: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLikeQuestion = (questionId: number) => {
    dispatch(likeQuestion(questionId));
  };

  return (
    <div className="w-full mx-auto p-2 md:px-40 md:py-6 bg-[#defcef] rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-secondary-color mb-6">Góc hỏi đáp</h1>

      <div className="mb-8">
        <textarea
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="Bạn có thắc mắc gì không? Hãy đặt câu hỏi..."
          className="w-full p-4 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm resize-none placeholder-gray-500"
        />
        <button
          onClick={handleAddQuestion}
          className="mt-3 px-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all"
        >
          Đăng câu hỏi
        </button>
      </div>

      <div className="space-y-6">
        {questions?.map((question) => (
          <div key={question.id} className="p-5 bg-white rounded-lg shadow-lg border border-green-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{question.content}</h2>
            <p className="text-xs text-gray-500 mb-3">Đã hỏi lúc {new Date(question?.createDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ngày {new Date(question?.createDate).toLocaleDateString('vi-VN')}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLikeQuestion(question.id)}
                className="flex items-center text-blue-500 hover:text-green-700"
              >
                <FaThumbsUp className="mr-1" /> Thích ({question.likeCount})
              </button>
              <p className="text-gray-600 text-sm">{question.comments.length} bình luận</p>
            </div>

            <div className="mt-4 space-y-4">
              {(expandedQuestions[question.id]
                ? question.comments
                : question.comments.slice(0, 1)
              ).map((comment) => (
                <div key={comment?.commentId} className="bg-gray-50 p-3 rounded-lg shadow-inner border border-gray-200 ml-4">
                  <p className="text-sm font-medium text-gray-800">{comment?.content}</p>
                  <p className="text-xs text-gray-400">Bình luận lúc {new Date(comment?.createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ngày {new Date(comment?.createdDate).toLocaleDateString('vi-VN')}</p>

                  <div className="ml-4 mt-2 space-y-2 border-l-4 border-green-200 pl-3">
                    {(expandedReplies[comment.commentId] 
                      ? comment?.replies 
                      : comment?.replies.slice(0, 1)
                    ).map((reply) => (
                      <div key={reply?.commentId} className="text-sm text-gray-700 bg-green-50 p-2 rounded-md shadow-sm">
                        {reply?.content}
                        <p className="text-xs text-gray-400">Đã trả lời lúc {new Date(reply?.createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ngày {new Date(reply?.createdDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    ))}
                    {comment.replies.length > 1 && (
                      <button
                        onClick={() => toggleReplies(comment.commentId)}
                        className="text-blue-600 hover:text-green-700 text-sm"
                      >
                        {expandedReplies[comment.commentId] ? 'Ẩn bớt phản hồi' : 'Xem thêm phản hồi'}
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      value={replyInputs[comment.commentId]}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [comment.commentId]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && replyInputs[comment.commentId]?.trim()) {
                          e.preventDefault(); // Ngăn hành động mặc định
                          handleAddReply(question.id, comment.commentId);
                        }
                      }}
                      placeholder="Phản hồi bình luận..."
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                    />
                    <button
                      onClick={() => handleAddReply(question.id, comment.commentId)}
                      className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              ))}
              {question.comments.length > 1 && (
                <button
                  onClick={() => toggleComments(question.id)}
                  className="text-blue-600 hover:text-green-700 text-sm mt-2"
                >
                  {expandedQuestions[question.id] ? 'Ẩn bớt bình luận' : 'Xem thêm bình luận'}
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={commentInputs[question.id] || ''}
                onChange={(e) =>
                  setCommentInputs({ ...commentInputs, [question.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentInputs[question.id]?.trim()) {
                    e.preventDefault(); // Ngăn hành động mặc định (nếu cần)
                    handleAddComment(question.id);
                  }
                }}
                placeholder="Viết bình luận..."
                className="w-full p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />
              <button
                onClick={() => handleAddComment(question.id)}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
              >
                Gửi
              </button>
            </div>
          </div>
        ))}
        {questions && questions.length < (totalQuestions ?? 0) && (
          <button
            onClick={handleLoadMore}
            className="mt-4 px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default QnAPage;
