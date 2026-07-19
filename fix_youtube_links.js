const mongoose = require("mongoose");
const LessonResource = require("./Backend/src/models/lessonResource.model");
const dotenv = require("dotenv");
dotenv.config({ path: "./Backend/.env" });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to DB");
  const resources = await LessonResource.find({ url: /youtube\.com\/results/ });
  for (const res of resources) {
    const url = new URL(res.url);
    const query = url.searchParams.get("search_query");
    console.log("Fixing:", query);
    try {
      const ytRes = await fetch(res.url);
      const text = await ytRes.text();
      const match = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match && match[1]) {
        res.url = "https://www.youtube.com/watch?v=" + match[1];
        await res.save();
        console.log("Updated to", res.url);
      }
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
  process.exit(0);
});
