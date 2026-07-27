import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // حالة تعديل الكومنت
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  // حالة حذف الكومنت
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  function getPostDetails() {
    setLoading(true);
    axios
      .get(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        setPost(res.data.data.post);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  // جلب كل الكومنتات في طلب منفصل (الـ API الجديد بيفصلهم عن تفاصيل البوست)
  function getComments() {
    axios
      .get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        console.log("COMMENTS:", res.data); // مؤقتًا للتأكد من الشكل
        setComments(res.data.data.comments || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getPostDetails();
    getComments();
  }, [id]);

  // إنشاء كومنت جديد
  function handleAddComment(e) {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", commentBody);

    axios
      .post(
        `https://route-posts.routemisr.com/posts/${id}/comments`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      )
      .then(() => {
        setCommentBody("");
        setIsSubmitting(false);
        getComments(); // نحدث الكومنتات بس، مش لازم نحدث البوست كله
      })
      .catch((err) => {
        console.log(err.response);
        setError(err.response?.data?.message || "حصل خطأ، حاول تاني");
        setIsSubmitting(false);
      });
  }

  // بدء تعديل كومنت
  function startEditingComment(comment) {
    setEditingCommentId(comment._id);
    setEditCommentBody(comment.content || "");
  }

  // إلغاء التعديل
  function cancelEditingComment() {
    setEditingCommentId(null);
    setEditCommentBody("");
  }

  // Update
function handleUpdateComment(commentId) {
  setIsUpdatingComment(true);

  const formData = new FormData();
  formData.append("content", editCommentBody);

  axios
    .put(
      `https://route-posts.routemisr.com/posts/${id}/comments/${commentId}`,
      formData,
      { headers: { token: localStorage.getItem("token") } }
    )
    .then(() => {
      setIsUpdatingComment(false);
      setEditingCommentId(null);
      getComments();
    })
    .catch((err) => {
      console.log(err.response);
      setIsUpdatingComment(false);
    });
}

// Delete
function handleDeleteComment(commentId) {
  const confirmDelete = window.confirm("متأكدة إنك عايزة تمسحي الكومنت ده؟");
  if (!confirmDelete) return;

  setDeletingCommentId(commentId);

  axios
    .delete(`https://route-posts.routemisr.com/posts/${id}/comments/${commentId}`, {
      headers: { token: localStorage.getItem("token") },
    })
    .then(() => {
      setDeletingCommentId(null);
      getComments();
    })
    .catch((err) => {
      console.log(err.response);
      setDeletingCommentId(null);
    });
}

  if (loading) {
    return <p className="text-center text-gray-500 py-10">جاري التحميل...</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 py-10">البوست مش موجود</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* البوست */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.user?.photo || "https://via.placeholder.com/40"}
              alt={post.user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{post.user?.name}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString("ar-EG")}
              </p>
            </div>
          </div>

          {post.body && (
            <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">{post.body}</p>
          )}

          {post.image && (
            <img src={post.image} alt="post" className="w-full rounded-lg object-cover max-h-96" />
          )}
        </div>

        {/* فورم إضافة كومنت */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          {error && (
            <p className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-3">{error}</p>
          )}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="اكتب تعليق..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {isSubmitting ? "..." : "تعليق"}
            </button>
          </form>
        </div>

        {/* الكومنتات */}
        <div className="space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-3">
                  <img
                    src={comment.commentCreator?.photo || "https://via.placeholder.com/32"}
                    alt={comment.commentCreator?.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {comment.commentCreator?.name}
                    </p>

                    {/* لو الكومنت ده في وضع التعديل */}
                    {editingCommentId === comment._id ? (
                      <div className="space-y-2 mt-1">
                        <input
                          value={editCommentBody}
                          onChange={(e) => setEditCommentBody(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={isUpdatingComment}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-xs font-medium px-3 py-1 rounded-md transition"
                          >
                            {isUpdatingComment ? "جاري الحفظ..." : "حفظ"}
                          </button>
                          <button
                            onClick={cancelEditingComment}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-md transition"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    )}
                  </div>
                </div>

                {/* أزرار تعديل/حذف الكومنت */}
                {editingCommentId !== comment._id && (
                  <div className="flex gap-4 mt-2 ms-11">
                    <button
                      onClick={() => startEditingComment(comment)}
                      className="text-gray-500 text-xs font-medium hover:text-blue-500"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={deletingCommentId === comment._id}
                      className="text-red-500 text-xs font-medium hover:text-red-600 disabled:text-gray-300"
                    >
                      {deletingCommentId === comment._id ? "جاري الحذف..." : "حذف"}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm">مفيش كومنتات لسه</p>
          )}
        </div>
      </div>
    </div>
  );
}
