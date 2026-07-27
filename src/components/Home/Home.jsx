import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postBody, setPostBody] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // حالة التعديل
  const [editingPostId, setEditingPostId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // حالة الحذف
  const [deletingPostId, setDeletingPostId] = useState(null);

  function getPosts() {
    setLoadingPosts(true);

    axios
      .get("https://route-posts.routemisr.com/posts?limit=10", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setPosts(res.data.data.posts);
        setLoadingPosts(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPosts(false);
      });
  }

  useEffect(() => {
    getPosts();
  }, []);

  // إنشاء بوست جديد
  function handleCreatePost(e) {
    e.preventDefault();

    if (!postBody.trim() && !image) {
      setError("اكتب حاجة أو ارفع صورة الأول");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("body", postBody);
    if (image) formData.append("image", image);

    axios
      .post("https://route-posts.routemisr.com/posts", formData, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        setPostBody("");
        setImage(null);
        setIsSubmitting(false);
        getPosts();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "حصل خطأ، حاول تاني");
        setIsSubmitting(false);
      });
  }

  // بدء التعديل
  function startEditing(post) {
    setEditingPostId(post._id);
    setEditBody(post.body || "");
  }

  // إلغاء التعديل
  function cancelEditing() {
    setEditingPostId(null);
    setEditBody("");
  }

  // حفظ التعديل (Update)
  function handleUpdatePost(postId) {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("body", editBody);

    axios
      .put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        setIsUpdating(false);
        setEditingPostId(null);
        getPosts(); // تحديث القائمة بعد التعديل
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
      });
  }

  // حذف البوست (Delete)
  function handleDeletePost(postId) {
    const confirmDelete = window.confirm("متأكدة إنك عايزة تمسحي البوست ده؟");
    if (!confirmDelete) return;

    setDeletingPostId(postId);

    axios
      .delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        setDeletingPostId(null);
        getPosts(); // تحديث القائمة بعد الحذف
      })
      .catch((err) => {
        console.log(err);
        setDeletingPostId(null);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* فورم إنشاء بوست */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            
            <h2 className="text-base font-semibold text-gray-800">
             بتفكر فيه ايه؟
            </h2>
          </div>

          {error && (
            <p className="bg-red-50 text-red-600 text-sm p-2.5 rounded-lg mb-3 border border-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder="اكتب بوست جديد..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 16l4-4a3 3 0 014 0l5 5m-5-5l1.5-1.5a3 3 0 014 0L21 16M5 8h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {image ? image.name : "إضافة صورة"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:bg-gray-300 disabled:active:scale-100 text-white text-sm font-medium px-6 py-2 rounded-full transition-all"
              >
                {isSubmitting ? "جاري النشر..." : "نشر"}
              </button>
            </div>
          </form>
        </div>

        {/* قائمة البوستات */}
        {loadingPosts ? (
          <p className="text-center text-gray-500">جاري تحميل البوستات...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">مفيش بوستات لسه</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0 overflow-hidden">
                  {post.user?.photo ? (
                    <img
                      src={post.user.photo}
                      alt={post.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    post.user?.name?.charAt(0) || "?"
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {post.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString("ar-EG")}
                  </p>
                </div>
              </div>

              {/* لو البوست ده في وضع التعديل */}
              {editingPostId === post._id ? (
                <div className="space-y-2 mb-3">
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdatePost(post._id)}
                      disabled={isUpdating}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                    >
                      {isUpdating ? "جاري الحفظ..." : "حفظ"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-lg transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {post.body && (
                    <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">
                      {post.body}
                    </p>
                  )}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full rounded-lg object-cover max-h-96 mb-3"
                    />
                  )}
                </>
              )}

              {/* الأزرار */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => navigate(`/posts/${post._id}`)}
                  className="text-blue-500 text-sm font-medium"
                >
                  عرض التفاصيل
                </button>

                {editingPostId !== post._id && (
                  <button
                    onClick={() => startEditing(post)}
                    className="text-gray-500 text-sm font-medium hover:text-blue-500"
                  >
                    تعديل
                  </button>
                )}

                <button
                  onClick={() => handleDeletePost(post._id)}
                  disabled={deletingPostId === post._id}
                  className="text-red-500 text-sm font-medium hover:text-red-600 disabled:text-gray-300"
                >
                  {deletingPostId === post._id ? "جاري الحذف..." : "حذف"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
