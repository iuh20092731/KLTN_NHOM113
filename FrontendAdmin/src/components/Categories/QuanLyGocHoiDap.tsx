import React, { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { deleteComment, deleteQuestions, getQuestions } from "../../redux/thunks/question";
import { toast } from 'react-toastify';

const QuanLyGocHoiDap: React.FC = () => {
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isCommentConfirmOpen, setIsCommentConfirmOpen] = useState<boolean>(false);
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null);
  const [isReplyConfirmOpen, setIsReplyConfirmOpen] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.question.data?.content);
  const totalQuestions = useSelector((state: RootState) => state.question.data?.totalElements);
  const [questionCount, setQuestionCount] = useState(3);

  useEffect(() => {
    dispatch(getQuestions({ page: 0, size: questionCount }));
  }, [questionCount]);

  const handleLoadMore = () => {
    setQuestionCount((prevCount) => prevCount + 5);
  };
  
  const handleDeleteQuestion = () => {
    if (questionToDelete !== null) {
      dispatch(deleteQuestions(questionToDelete)).then(()=> {
        dispatch(getQuestions({ page: 0, size: questionCount }));
        toast.success("Xóa câu hỏi thành công!");
        setQuestionToDelete(null);
        setIsConfirmOpen(false);
      })
      
    }
  };

  const handleOpenConfirm = (id: number) => {
    setQuestionToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleOpenCommentConfirm = (commentId: number) => {
    setCommentToDelete(commentId);
    setIsCommentConfirmOpen(true);
  };

  const handleConfirmDeleteComment = () => {
    if (commentToDelete !== null) {
      dispatch(deleteComment(commentToDelete)).then(() => {
        dispatch(getQuestions({ page: 0, size: questionCount }));
        toast.success("Xóa bình luận thành công!");
        setCommentToDelete(null);
        setIsCommentConfirmOpen(false);
      });
    }
  };

  const handleOpenConfirmReply = (replyId: number) => {
    setReplyToDelete(replyId);
    setIsReplyConfirmOpen(true)
  }

  const handleConfirmDeleteReply = () => {
    if(replyToDelete !== null) {
      dispatch(deleteComment(replyToDelete)).then(()=> {
        dispatch(getQuestions({ page: 0, size: questionCount }));
        toast.success("Xóa phản hồi thành công!");
        setReplyToDelete(null);
        setIsReplyConfirmOpen(false)
      })
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý Q&A</h1>
      {questions?.map((question) => (
        <div key={question.id} className="p-4 bg-white rounded-md shadow mb-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">{question.content}</h2>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleOpenConfirm(question.id)}
            >
              Xóa câu hỏi
            </button>
          </div>
          <p className="text-sm text-gray-500">Likes: {question?.likeCount}</p>
          <ul className="mt-2 space-y-2">
            {question.comments.map((comment) => (
              <li key={comment.commentId} className="p-2 bg-gray-50 rounded shadow">
                <div className="flex justify-between">
                  <p>{comment.content}</p>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleOpenCommentConfirm(comment.commentId)}
                  >
                    Xóa bình luận
                  </button>
                </div>
                <ul className="ml-4 mt-2 space-y-1">
                  {comment.replies.map((reply) => (
                    <li key={reply.commentId} className="flex justify-between text-sm">
                      <p>{reply.content}</p>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() =>
                          handleOpenConfirmReply(reply.commentId)
                        }
                      >
                        Xóa phản hồi
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa câu hỏi này không? Lưu ý khi xóa sẽ mất toàn bộ bình luận và phản hồi.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isCommentConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa bình luận</h3>
            <p>Bạn có chắc chắn muốn xóa bình luận này không? Lưu ý khi xóa sẽ mất các phản hồi của bình luận này</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsCommentConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteComment}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isReplyConfirmOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                  <h3 className="text-lg font-bold mb-4">Xác nhận xóa Phản hồi</h3>
                  <p>Bạn có chắc chắn muốn xóa Phản hồi này không?</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setIsReplyConfirmOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirmDeleteReply}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default QuanLyGocHoiDap;
