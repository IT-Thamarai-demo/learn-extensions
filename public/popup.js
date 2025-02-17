document.addEventListener("DOMContentLoaded", () => {
    const videoUrlInput = document.getElementById("video-url");
    const addVideoBtn = document.getElementById("add-video");
    const videoFrame = document.getElementById("video-frame");
    const prevBtn = document.getElementById("prev-video");
    const nextBtn = document.getElementById("next-video");
    const videoListContainer = document.getElementById("video-list");
    const noVideosMessage = document.getElementById("no-videos");

    const openSidebarBtn = document.getElementById("open-sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const sidebar = document.getElementById("sidebar");

    let videoList = [];
    let currentIndex = 0;

    // Load stored videos
    function loadStoredVideos() {
        videoList = JSON.parse(localStorage.getItem("videos")) || [];
        updateSidebar();
        if (videoList.length > 0) {
            loadVideo(0);
        }
    }

    loadStoredVideos();

    // Add new video
    addVideoBtn.addEventListener("click", () => {
        const url = videoUrlInput.value.trim();
        const videoId = extractYouTubeID(url);
        const videoTitle = extractYouTubeTitle(url);

        if (videoId) {
            const newVideo = { id: videoId, title: videoTitle };
            videoList.push(newVideo);
            localStorage.setItem("videos", JSON.stringify(videoList));

            videoUrlInput.value = "";
            loadVideo(videoList.length - 1);
            updateSidebar();
        } else {
            alert("Please enter a valid YouTube URL.");
        }
    });

    // Load video
    function loadVideo(index) {
        if (index >= 0 && index < videoList.length) {
            videoFrame.src = `https://www.youtube.com/embed/${videoList[index].id}`;
            currentIndex = index;
        } else {
            videoFrame.src = ""; // Clear the frame if no videos are left
        }
    }

    // Update sidebar
    function updateSidebar() {
        videoListContainer.innerHTML = "";
        if (videoList.length === 0) {
            noVideosMessage.classList.remove("hidden");
            videoFrame.src = ""; // Clear video when no videos are left
        } else {
            noVideosMessage.classList.add("hidden");
            videoList.forEach((video, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<span>${video.title}</span> <button class="delete-video" data-index="${index}">🗑</button>`;
                listItem.addEventListener("click", () => loadVideo(index));
                videoListContainer.appendChild(listItem);
            });
        }
    }

    // Delete video function
    function deleteVideo(index) {
        videoList.splice(index, 1);
        localStorage.setItem("videos", JSON.stringify(videoList));
        updateSidebar();

        // Adjust currentIndex after deletion
        if (videoList.length > 0) {
            currentIndex = index >= videoList.length ? videoList.length - 1 : index;
            loadVideo(currentIndex);
        } else {
            videoFrame.src = "";
        }
    }

    // Event delegation for delete buttons
    videoListContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-video")) {
            const index = event.target.getAttribute("data-index");
            deleteVideo(parseInt(index));
        }
    });

    // Sidebar toggle
    openSidebarBtn.addEventListener("click", () => sidebar.classList.add("show"));
    closeSidebarBtn.addEventListener("click", () => sidebar.classList.remove("show"));

    // Previous/Next buttons
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            loadVideo(currentIndex - 1);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < videoList.length - 1) {
            loadVideo(currentIndex + 1);
        }
    });

    // Extract YouTube ID
    function extractYouTubeID(url) {
        const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
        return match ? match[1] : null;
    }

    // Extract YouTube Title
    function extractYouTubeTitle(url) {
        return `Video ${videoList.length + 1}`;
    }
});
