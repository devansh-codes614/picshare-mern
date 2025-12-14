import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const loadPosts = async () => {
    const res = await fetch("http://localhost:5000/post/feed", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    setPosts(data);
  };

  const likePost = async (id) => {
    await fetch(`http://localhost:5000/post/like/${id}`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    loadPosts();
  };

  const deletePost = async (id) => {
    await fetch(`http://localhost:5000/post/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div style={{ width: 400, margin: "auto" }}>
      <h2>📸 PicShare Feed</h2>

      <button onClick={() => navigate("/create")}>Create Post</button>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        style={{ marginLeft: 10 }}
      >
        Logout
      </button>

      <hr />

      {posts.map((p) => (
        <div key={p._id} style={{ marginBottom: 20 }}>
          <img
            src={`http://localhost:5000/uploads/${p.image}`}
            alt=""
            style={{ width: "100%" }}
          />

          <p>{p.caption}</p>

          <button onClick={() => likePost(p._id)}>
            ❤️ {p.likes.length}
          </button>

          {/* 🔥 DELETE BUTTON */}
          <button
            onClick={() => deletePost(p._id)}
            style={{ marginLeft: 10, color: "red" }}
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
