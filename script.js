// Get elements
const addBlogBtn = document.getElementById("addBlogBtn");
const popupModal = document.getElementById("popupModal");
const closeModal = document.getElementById("closeModal");
const blogForm = document.getElementById("blogForm");
const contentSection = document.getElementById("contentSection");

// Define character limit for truncation
const CHAR_LIMIT = 100; // Limit for blog content

// Get elements for the "view full content" modal
const viewBlogModal = document.getElementById("viewBlogModal");
const closeViewModal = document.getElementById("closeViewModal");
const viewBlogTitle = document.getElementById("viewBlogTitle");
const viewBlogContent = document.getElementById("viewBlogContent");

// Load blogs from localStorage on page load
let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

// Function to update the main content section
function renderBlogs() {
  contentSection.innerHTML = "<h2 class='text-2xl font-semibold mb-4'>Main Content</h2>";

  // If there are no blogs, show a message
  if (blogs.length === 0) {
    contentSection.innerHTML += "<p>No blogs to display.</p>";
  } else {
    // Render each blog
    blogs.forEach((blog, index) => {
      const blogPost = document.createElement("div");
      blogPost.classList.add("mb-6", "p-4", "bg-gray-50", "rounded-lg", "shadow-md");

      // Truncate the content if it exceeds the character limit
      let truncatedContent = blog.content;
      let isTruncated = false;
      if (blog.content.length > CHAR_LIMIT) {
        truncatedContent = blog.content.substring(0, CHAR_LIMIT) + '...';
        isTruncated = true;
      }

      // Add the blog title, truncated content, and buttons to the post
      blogPost.innerHTML = `
        <h3 class="text-xl font-semibold">${blog.title}</h3>
        <p class="text-gray-700 mt-2">${truncatedContent}</p>
        <div class="mt-4 flex items-center">
          ${isTruncated ? '<button class="readMore bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2">Read More</button>' : ''}
          <button class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2">Edit</button>
          <button class="bg-red-500 text-white p-2 rounded hover:bg-red-600 mr-2">Delete</button>
          <button class="eyeIcon bg-green-500 text-white p-2 rounded hover:bg-green-600 hidden">👁️ ${blog.readCount}</button>
        </div>
      `;

      // Show the eye icon if read count > 0
      const eyeIconBtn = blogPost.querySelector(".eyeIcon");
      if (blog.readCount > 0) {
        eyeIconBtn.classList.remove("hidden"); // Show the eye icon if the blog has been read
      }

      // Event listener for Read More
      if (isTruncated) {
        const readMoreBtn = blogPost.querySelector(".readMore");
        readMoreBtn.addEventListener("click", () => {
          // Increment view count (update view count in the blog object)
          blogs[index].readCount++;
          localStorage.setItem('blogs', JSON.stringify(blogs));

          // Open the "view full content" modal
          viewBlogTitle.textContent = blog.title;
          viewBlogContent.textContent = blog.content;
          viewBlogModal.classList.remove("hidden");

          // Show the eye icon with updated view count
          eyeIconBtn.classList.remove("hidden"); // Unhide the eye icon and display the updated count
        });
      }

      // Event listener for Delete
      const deleteBtn = blogPost.querySelector(".bg-red-500");
      deleteBtn.addEventListener("click", () => {
        // Delete blog from array and update local storage
        blogs.splice(index, 1);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        renderBlogs(); // Re-render the blogs
      });

      // Event listener for Eye Icon (to show the count)
      eyeIconBtn.addEventListener("click", () => {
        // Optional: Show a popup or console log to show that the blog has been read
        console.log(`This blog has been read ${blogs[index].readCount} times.`);
      });

      contentSection.appendChild(blogPost);
    });
  }
}

// Show popup when "Add Blog" button is clicked
addBlogBtn.addEventListener("click", () => {
  popupModal.classList.remove("hidden");
});

// Close popup when "Cancel" button is clicked
closeModal.addEventListener("click", () => {
  popupModal.classList.add("hidden");
});

// Handle form submission
blogForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const blogTitle = document.getElementById("blogTitle").value;
  const blogContent = document.getElementById("blogContent").value;

  // Create a new blog post object
  const newBlog = {
    title: blogTitle,
    content: blogContent,
    readCount: 0 // Initialize read count
  };

  // Add the new blog to the array and update local storage
  blogs.push(newBlog);
  localStorage.setItem('blogs', JSON.stringify(blogs));

  // Close the modal after submission
  popupModal.classList.add("hidden");

  // Optionally, clear the form
  blogForm.reset();

  // Re-render the blogs
  renderBlogs();
});

// Close the "view full content" modal when "Close" button is clicked
closeViewModal.addEventListener("click", () => {
  viewBlogModal.classList.add("hidden");
});

// Initial render on page load
renderBlogs();
