import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

function getProfileData() {
  setLoading(true);
  axios
    .get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { token: localStorage.getItem("token") },
    })
    .then((res) => {
  console.log(res.data);
  console.log(res.data.data.user);

  setUser(res.data.data.user);
  setLoading(false);
  getUserPosts(res.data.data.user._id);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
}
function getUserPosts(userId) {
  axios
    .get(`https://route-posts.routemisr.com/users/${userId}/posts?limit=20`, {
      headers: { token: localStorage.getItem("token") },
    })
   .then((res) => {
  console.log("Posts response:", res.data);
  console.log("Posts data:", res.data.data);

  setPosts(res.data.data.posts || []);
})
    .catch((err) => {
      console.log(err);
    });
}
  useEffect(() => {
    getProfileData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">جاري التحميل...</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-500 py-10">تعذر تحميل البيانات</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* بيانات اليوزر */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <img
            src={user.photo || "https://via.placeholder.com/100"}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          {user.dateOfBirth && (
            <p className="text-gray-400 text-xs mt-1">
              تاريخ الميلاد: {new Date(user.dateOfBirth).toLocaleDateString("ar-EG")}
            </p>
          )}

          <button
            onClick={() => navigate("/change-password")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            تغيير كلمة المرور
          </button>
        </div>

        {/* بوستات اليوزر */}
        <h2 className="text-lg font-bold text-gray-800">بوستاتي</h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">مفيش بوستات لسه</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-md p-5">
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
              <button
                onClick={() => navigate(`/posts/${post._id}`)}
                className="text-blue-500 text-sm font-medium"
              >
                عرض التفاصيل
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}