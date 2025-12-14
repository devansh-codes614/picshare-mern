import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const submitPost = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    await fetch("http://localhost:5000/post/create", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
    });

    navigate("/dashboard");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Post</h2>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br /><br />

      <input
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <br /><br />

      <button onClick={submitPost}>Post</button>
    </div>
  );
}

export default CreatePost;
