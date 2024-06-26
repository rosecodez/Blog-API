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
    published.setAttribute("id", "pusblished");
    postContainer.appendChild(published);

    title.textContent = post.title;
    text.textContent = post.text;
    timestamp.textContent = post.timestamp;

    posts.append(postContainer);
  });
}
Promise.all([
  fetch("http://localhost:3000/posts", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Data:", data);
      let posts = [];
      posts.push(data);
      displayPosts(data);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    }),
]);
