const express = require("express");
const cors = require("cors");
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());
app.use(express.json()); // Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.post("/download", async (req, res) => {
    console.log("Request Body:", req.body);

    if (!req.body || !req.body.url) {
        return res.status(400).json({ error: "Invalid or missing URL" });
    }

    const videoUrl = req.body.url;
    
    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        console.log("Fetching video info...");
        const info = await ytdl.getInfo(videoUrl);
        console.log("Video Title:", info.videoDetails.title);

        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
        res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
        res.header("Content-Type", "video/mp4");

        const videoStream = ytdl(videoUrl, { quality: "highestvideo" });

        videoStream.on("error", (err) => {
            console.error("ytdl-core Error:", err);
            res.status(500).json({ error: "Failed to stream video" });
        });

        videoStream.pipe(res);
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ error: "Failed to download video" });
    }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
