const { DateTime } = luxon;

function displayPosts(array) {
  const posts = document.getElementById("posts");
  array.forEach((post) => {
    const postContainer = document.createElement("div");
    postContainer.classList.add("post");

    const title = document.createElement("h4");
    title.setAttribute("id", "title");
    postContainer.appendChild(title);

    const text = document.createElement("p");
    text.setAttribute("id", "text");
    postContainer.appendChild(text);

    const timestamp = document.createElement("p");
    timestamp.setAttribute("id", "timestamp");
    postContainer.appendChild(timestamp);

    const published = document.createElement("p");
    published.setAttribute("id", "published");
    postContainer.appendChild(published);

    title.textContent = post.title;
    text.textContent = post.text;

    if (post.timestamp) {
      timestamp.textContent = DateTime.fromISO(post.timestamp).toLocaleString(
        DateTime.DATE_MED
      );
    } else {
      console.warn("Post has no timestamp:", post);
    }

    posts.appendChild(postContainer);
  });
}

fetch("http://localhost:3000/posts", { mode: "cors" })
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(function (data) {
    console.log("Data:", data);
    displayPosts(data);
  })
  .catch(function (error) {
    console.error("Fetch error:", error);
  });
