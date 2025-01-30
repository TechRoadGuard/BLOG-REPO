
const addBlogBtn = document.getElementById("addBlogBtn");
const popupModal = document.getElementById("popupModal");
const closeModal = document.getElementById("closeModal");
const blogForm = document.getElementById("blogForm");
const contentSection = document.getElementById("contentSection");

const CHAR_LIMIT = 100; 


const viewBlogModal = document.getElementById("viewBlogModal");
const closeViewModal = document.getElementById("closeViewModal");
const viewBlogTitle = document.getElementById("viewBlogTitle");
const viewBlogContent = document.getElementById("viewBlogContent");


let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let editIndex = null; 


function renderBlogs() {
  contentSection.innerHTML = "<h2 class='text-2xl font-semibold mb-4'>Main Content</h2>";

  
  if (blogs.length === 0) {
    contentSection.innerHTML += "<p>No blogs to display.</p>";
  } else {
    
    blogs.forEach((blog, index) => {
      const blogPost = document.createElement("div");
      blogPost.classList.add("mb-6", "p-4", "bg-gray-50", "rounded-lg", "shadow-md");

      
      let truncatedContent = blog.content.length > CHAR_LIMIT 
        ? blog.content.substring(0, CHAR_LIMIT) + '...' 
        : blog.content;

      
      blogPost.innerHTML = `
        <h3 class="text-xl font-semibold">${blog.title}</h3>
        <p class="text-gray-700 mt-2">${truncatedContent}</p>
        <div class="mt-4 flex items-center">
          ${blog.content.length > CHAR_LIMIT 
            ? '<button class="readMore text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 rounded ">Read More</button>' 
            : ''}
          <button onclick="editb(${index})" class=" rounded text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Edit</button>
          <button onclick="deleteBlog(${index})" class=" p-2 rounded text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Delete</button>
          <button class="eyeIcon text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 rounded  hidden">👁️ ${blog.readCount}</button>
        </div>
      `;

      
      const eyeIconBtn = blogPost.querySelector(".eyeIcon");
      if (blog.readCount > 0) {
        eyeIconBtn.classList.remove("hidden");
      }

      
      if (blog.content.length > CHAR_LIMIT) {
        const readMoreBtn = blogPost.querySelector(".readMore");
        readMoreBtn.addEventListener("click", () => {
          
          blogs[index].readCount++;

          
          localStorage.setItem('blogs', JSON.stringify(blogs));

          
          viewBlogTitle.textContent = blog.title;
          viewBlogContent.textContent = blog.content;
          viewBlogModal.classList.remove("hidden");

          
          eyeIconBtn.classList.remove("hidden");

          
          eyeIconBtn.textContent = `👁️ ${blogs[index].readCount}`;
        });
      }

      contentSection.appendChild(blogPost);
    });
  }
}


function editb(index) {
  editIndex = index; 
  const blog = blogs[index];

  document.getElementById("blogTitle").value = blog.title;
  document.getElementById("blogContent").value = blog.content;
  popupModal.classList.remove("hidden");
}


addBlogBtn.addEventListener("click", () => {
  blogForm.reset();
  editIndex = null; 
  popupModal.classList.remove("hidden");
});


closeModal.addEventListener("click", () => {
  popupModal.classList.add("hidden");
});


blogForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const blogTitle = document.getElementById("blogTitle").value.trim();
  const blogContent = document.getElementById("blogContent").value.trim();

  if (!blogTitle || !blogContent) {
    alert("Please enter both a blog title and content.");
    return;
  }

  if (editIndex !== null) {
    
    blogs[editIndex] = { title: blogTitle, content: blogContent, readCount: blogs[editIndex].readCount };
    editIndex = null;
  } else {
    
    blogs.push({ title: blogTitle, content: blogContent, readCount: 0 });
  }

  localStorage.setItem('blogs', JSON.stringify(blogs));
  popupModal.classList.add("hidden");
  blogForm.reset();
  renderBlogs();
});


function deleteBlog(index) {
  blogs.splice(index, 1);
  localStorage.setItem('blogs', JSON.stringify(blogs));
  renderBlogs();
}


closeViewModal.addEventListener("click", () => {
  viewBlogModal.classList.add("hidden");
});


renderBlogs();
