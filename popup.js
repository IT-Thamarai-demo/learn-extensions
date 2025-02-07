document.addEventListener("DOMContentLoaded", () => {
    const videoUrlInput = document.getElementById("video-url");
    const addVideoBtn = document.getElementById("add-video");
    const videoFrame = document.getElementById("video-frame");
    const prevBtn = document.getElementById("prev-video");
    const nextBtn = document.getElementById("next-video");

    let videoList = [];
    let currentIndex = 0;

    // Load stored videos
    chrome.storage.sync.get("videos", (data) => {
        if (data.videos) {
            videoList = data.videos;
            loadVideo(currentIndex);
        }
    });

    // Add new video
    addVideoBtn.addEventListener("click", () => {
        const url = videoUrlInput.value.trim();
        if (url && url.includes("youtube.com")) {
            const videoId = extractYouTubeID(url);
            if (videoId) {
                videoList.push(videoId);
                chrome.storage.sync.set({ videos: videoList });
                videoUrlInput.value = "";
                loadVideo(videoList.length - 1);
            }
        } else {
            alert("Please enter a valid YouTube URL.");
        }
    });

    // Load video from list
    function loadVideo(index) {
        if (videoList.length > 0 && index >= 0 && index < videoList.length) {
            videoFrame.src = `https://www.youtube.com/embed/${videoList[index]}`;
            currentIndex = index;
        }
    }

    // Previous Video
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            loadVideo(currentIndex - 1);
        }
    });

    // Next Video
    nextBtn.addEventListener("click", () => {
        if (currentIndex < videoList.length - 1) {
            loadVideo(currentIndex + 1);
        }
    });

    // Extract YouTube Video ID
    function extractYouTubeID(url) {
        const match = url.match(/v=([^&]+)/);
        return match ? match[1] : null;
    }
    chrome.storage.sync.get("videos", (data) => console.log(data));

});
