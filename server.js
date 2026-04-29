const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();

// This endpoint allows your app to request music
// Usage: https://your-server-url.com/play?id=VIDEO_ID
app.get('/play', async (req, res) => {
    const videoID = req.query.id;
    if (!videoID) return res.status(400).send("Missing ID");

    try {
        // 1. Tell YouTube we are a real Chrome browser
        const options = {
            filter: 'audioonly',
            quality: 'highestaudio',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            }
        };

        // 2. Set the response type to audio
        res.setHeader('Content-Type', 'audio/mpeg');

        // 3. The "Trick": Pipe the data directly from YouTube to your App
        ytdl(videoID, options).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching audio");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
