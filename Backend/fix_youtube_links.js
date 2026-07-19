const mongoose = require('mongoose');
const LessonResource = require('./src/models/lessonResource.model');
require('dotenv').config({ path: '../.env' });

// Only fill resources that are currently blank. Existing URLs are preserved.
const VIDEO_URLS = {
  'Learning Figma Part 1': 'https://www.youtube.com/embed/0uqoVYo0Lvk',
  'Learning Figma Part 2': 'https://www.youtube.com/embed/qB2YoIBwYpc',
  'Learning Figma Part 3': 'https://www.youtube.com/embed/bQe8bRd1v1Y',
  'Learning Figma Part 4': 'https://www.youtube.com/embed/mtSLjyK5SHo',
  'Learning Figma Part 5': 'https://www.youtube.com/embed/96seNl1Wm-k',
  'UI/ UX ဆိုတာဘာလဲနှင့် UI အတွက်သုံးသင့်သော Tools များ': 'https://www.youtube.com/embed/mo0KGK0ndRA',
  'UI Design ဘယ်လိုစလေ့ကျင့်ရမလဲ': 'https://www.youtube.com/embed/xpA0U8d8AcI',
  'သူများဆွဲထားတဲ့ UI Design ကိုဘယ်လိုအတုယူရမလဲ': 'https://www.youtube.com/embed/uLMJdzE0fXA',
  'သူများဆွဲထားတဲ့ Web Design အတုယူနည်း (02': 'https://www.youtube.com/embed/5R1dQxu0HqM',
  'User-Centred Design ဆိုတာဘာလဲ': 'https://www.youtube.com/embed/BPICxdk5k08',
  'Cognitive Load in UX': 'https://www.youtube.com/embed/6kLUXvPyRqA',
  'UX မှာ Tool တွေထက် Thinking က ဘာလို့ ပိုအရေးကြီးတာလဲ': 'https://www.youtube.com/embed/8ZtVtG0Ug8s',
  'UX Designer တစ်ယောက်လို ဘယ်လိုစဉ်းစားကြမလဲ': 'https://www.youtube.com/embed/rTcwvClAEd0',
  'Client တွေလိုအပ်မယ့် Design ကောင်း/ System ကောင်းဘယ်လိုဖန်တီးမလဲ?': 'https://www.youtube.com/embed/YnUlXL__6Cs',
  'portfolio ကောင်းတစ်ခုကိုဘယ်လိုဖန်တီးမလဲ?': 'https://www.youtube.com/embed/Z0Mrqh2Z6Zg',
  'Portfolio ဆိုတာ ဘာလဲ? ဘယ်လိုလုပ်ရမလဲ?': 'https://www.youtube.com/embed/SRA5qIaNSQw',
  'အလုပ်လျှောက်ဖို့ Portfolio ရှိပြီလား?': 'https://www.youtube.com/embed/tWlyB80KCno',
};

async function updateVideoLinks() {
  await mongoose.connect(process.env.MONGODB_URI);

  const titles = Object.keys(VIDEO_URLS);
  const result = await LessonResource.bulkWrite(
    titles.map(title => ({
      updateOne: {
        filter: { title, type: 'video', url: { $in: ['', '#'] } },
        update: { $set: { url: VIDEO_URLS[title] } },
      },
    }))
  );

  console.log(`Matched ${result.matchedCount} records; updated ${result.modifiedCount} blank video URLs.`);
  await mongoose.disconnect();
}

updateVideoLinks().catch(async (error) => {
  console.error('Failed to update YouTube links:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
