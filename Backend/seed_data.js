/**
 * LanPya - Full Data Seed Script
 * ─────────────────────────────
 * Seeds: Category → Skill → Roadmap → Module → Lesson → LessonResource
 *
 * Run with:  node seed_data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ── Models ──────────────────────────────────────────────────────────
const Category     = require('./src/models/category.model');
const Skill        = require('./src/models/skill.model');
const Roadmap      = require('./src/models/roadmap.model');
const Module       = require('./src/models/module.model');
const Lesson       = require('./src/models/lesson.model');
const LessonResource = require('./src/models/lessonResource.model');
const User         = require('./src/models/user.model');
const Role         = require('./src/models/role.model');

// ── Thumbnails Mapping ──────────────────────────────────────────────
const ROADMAP_THUMBNAILS = {
  "basic photoshop": "/courses/adobe photoshop.png",
  "typography": "/courses/typography.png",
  "color theory": "/courses/color theory.png",
  "adobe illustrator": "/courses/adobe illustrator.png",
  "branding": "/courses/branding.png",
  "cv & portfolio building": "/courses/portfolio.png"
};

// ── Skills Data ─────────────────────────────────────────────────────
const SKILLS_DATA = [
  {
    category: "Foundation Skills",
    name: "Computer Basics"
  },
  {
    category: "Foundation Skills",
    name: "Internet & Email"
  },
  {
    category: "Foundation Skills",
    name: "Microsoft Word"
  },
  {
    category: "Foundation Skills",
    name: "Excel"
  },
  {
    category: "Foundation Skills",
    name: "PowerPoint"
  },
  {
    category: "Foundation Skills",
    name: "Google Workspace"
  },
  {
    category: "Graphic Design Skills",
    name: "Basic Photoshop"
  },
  {
    category: "Graphic Design Skills",
    name: "Typography"
  },
  {
    category: "Graphic Design Skills",
    name: "Color Theory"
  },
  {
    category: "Graphic Design Skills",
    name: "Adobe Illustrator"
  },
  {
    category: "Graphic Design Skills",
    name: "Branding"
  },
  {
    category: "Web",
    name: "HTML"
  },
  {
    category: "Web",
    name: "JavaScript"
  },
  {
    category: "Web",
    name: "PHP/Laravel"
  },
  {
    category: "Web",
    name: "Database"
  },
  {
    category: "Web",
    name: "Web Hosting"
  },
  {
    category: "Web",
    name: "Laravel"
  },
  {
    category: "Web",
    name: "CSS"
  },
  {
    category: "Web",
    name: "Node.js/Express.js"
  },
  {
    category: "Video Editing",
    name: "CapCut"
  },
  {
    category: "Video Editing",
    name: "Premiere Pro"
  },
  {
    category: "Video Editing",
    name: "DaVinci Resolve"
  },
  {
    category: "Video Editing",
    name: "After Effects"
  },
  {
    category: "Video Editing",
    name: "Prompting & Motion"
  },
  {
    category: "Marketing",
    name: "TikTok Marketing"
  },
  {
    category: "Marketing",
    name: "SEO"
  },
  {
    category: "Marketing",
    name: "Email Marketing"
  },
  {
    category: "Content Creation",
    name: "Content Writing"
  },
  {
    category: "Content Creation",
    name: "Copywriting"
  },
  {
    category: "Content Creation",
    name: "Blog Writing"
  },
  {
    category: "Content Creation",
    name: "Social Media Content"
  },
  {
    category: "Content Creation",
    name: "Storytelling"
  },
  {
    category: "AI Skills",
    name: "Prompt Engineering"
  },
  {
    category: "AI Skills",
    name: "ChatGPT"
  },
  {
    category: "AI Skills",
    name: "Agentic AI"
  },
  {
    category: "AI Skills",
    name: "AI Automation"
  },
  {
    category: "AI Skills",
    name: "Generative AI"
  },
  {
    category: "Data Analyst Skills",
    name: "Power BI"
  },
  {
    category: "Data Analyst Skills",
    name: "Excel Analytics"
  },
  {
    category: "Data Analyst Skills",
    name: "SQL"
  },
  {
    category: "Data Analyst Skills",
    name: "Data Visualization"
  },
  {
    category: "Cybersecurity",
    name: "Networking Basics"
  },
  {
    category: "Cybersecurity",
    name: "Cybersecurity Fundamentals"
  },
  {
    category: "Cybersecurity",
    name: "Ethical Hacking Basics"
  },
  {
    category: "Freelancing & Career",
    name: "Fiverr"
  },
  {
    category: "Freelancing & Career",
    name: "Upwork"
  },
  {
    category: "Freelancing & Career",
    name: "LinkedIn Profile"
  },
  {
    category: "Freelancing & Career",
    name: "CV & Portfolio Building"
  },
  {
    category: "Freelancing & Career",
    name: "Interview Preparation"
  },
  {
    category: "Freelancing & Career",
    name: "Online Income Guide"
  },
  {
    category: "Digital Marketing",
    name: "Content Marketing"
  },
  {
    category: "Digital Marketing",
    name: "SEO"
  },
  {
    category: "Digital Marketing",
    name: "Email Marketing"
  },
  {
    category: "Content Creation",
    name: "The Hook"
  },
  {
    category: "Content Creation",
    name: "Thumbnails"
  },
  {
    category: "Content Creation",
    name: "Production"
  },
  {
    category: "Content Creation",
    name: "Capcut"
  },
  {
    category: "Content Creation",
    name: "Publishing"
  },
  {
    category: "Data  Analyst Skills",
    name: "Excel Analytics"
  },
  {
    category: "Digital Marketing",
    name: "Social Media Marketing"
  },
  {
    category: "Digital Marketing",
    name: "Performance Marketing"
  },
  {
    category: "Graphic Design Skills",
    name: "Portfolio"
  },
  {
    category: "UI/UX",
    name: "Design Principles"
  },
  {
    category: "UI/UX",
    name: "Figma"
  },
  {
    category: "UI/UX",
    name: "UI"
  },
  {
    category: "UI/UX",
    name: "UX"
  },
  {
    category: "UI/UX",
    name: "Prototype"
  },
  {
    category: "Programming",
    name: "Python"
  },
  {
    category: "Programming",
    name: "Java"
  },
  {
    category: "Programming",
    name: "Database and sql"
  },
  {
    category: "Programming",
    name: "Algorithms & Data Structures"
  },
  {
    category: "Programming",
    name: "Git/GitHub & Basic Cloud Hosting"
  }
];

// ── Courses / Lessons Data ───────────────────────────────────────────
// Each entry: title (matches skill name loosely), lessons = [{title, youtubeUrl}]
const COURSES_DATA = [
  {
    title: "DaVinci Resolve",
    skillName: "DaVinci Resolve",
    lessons: [
      {
        title: "DaVinci Resolve Color Management (အခြေခံ) Chapter 1 , Lesson 1",
        youtubeUrl: "https://www.youtube.com/watch?v=UHKBEf_wKvc"
      },
      {
        title: "Professional Color Grading အတွက် Nodes တွေဘာကြောင့် အရေးပါသလဲ? DaVinci Resolve (အခြေခံ) Chapter 1, Lesson 2",
        youtubeUrl: "https://www.youtube.com/watch?v=SlGLTDMKlGU"
      },
      {
        title: "Color Grading ကို ဘယ်လို အလွယ်တကူ ပြောင်းသလဲ? | DaVinci Resolve PowerGrade (Chapter 1, Lesson 3)",
        youtubeUrl: "https://www.youtube.com/watch?v=U6dsjMfDNbE"
      },
      {
        title: "Color Grading Workflow မြန်ဆန်ထိရောက်အောင် DaVinci Resolve Node Management (Chapter 1, Lesson 4)",
        youtubeUrl: "https://www.youtube.com/watch?v=cAbJ0LFol58"
      },
      {
        title: "DaVinci Resolve မှာ မမြင့်ဖူးသေးတဲ့ အရောင်ချဲ့ (Wide Gamut & LUTs) (Chapter 1, Lesson 5)",
        youtubeUrl: "https://www.youtube.com/watch?v=g6swZjYRBJM"
      },
      {
        title: "DaVinci Resolve Export Setting: မိတ်ဆွေကို Perfect ဖြစ်အောင်! (Chapter 1, Lesson 6)",
        youtubeUrl: "https://www.youtube.com/watch?v=4w44ini30-Q"
      },
      {
        title: "Professional Color Gradingအတွက်Nodesတွေဘာကြောင့်အရေးပါသလဲ? DaVinci Resolve(အခြေခံ)Chapter 1,Lesson 2",
        youtubeUrl: ""
      },
      {
        title: "Color Grading ကို ဘယ်လိုအလွယ်တကူ ပြန်သုံးမလဲ? | DaVinci Resolve PowerGrade (Chapter 1, Lesson 3)",
        youtubeUrl: ""
      },
      {
        title: "Color Grading Workflow မြန်ဆန်ထိရောက်စေရန် DaVinci Resolve Node Management ( Chapter 1, Lesson 4)",
        youtubeUrl: ""
      },
      {
        title: "DaVinci Resolve မှာ မမြင်ဖူးသေးတဲ့ အရောင်စွမ်းအား? | Wide Gamut & LUTs (Chapter 1, Lesson 5)",
        youtubeUrl: ""
      },
      {
        title: "DaVinci Resolve Export Setting: မိတ်ဆွေရဲ့ရောင်တွေ အမြဲ Perfect ဖြစ်ဖို့! (Chapter 1, Lesson 6 )",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "CapCut",
    skillName: "CapCut",
    lessons: [
      {
        title: "How To Use Capcut/Mobile Video Editing Tutorial For Beginner",
        youtubeUrl: "https://www.youtube.com/watch?v=a5s1m8VqFqE"
      },
      {
        title: "Computer နဲ့ video editing လုပ်ပြောင်းနည်း CapCut PC",
        youtubeUrl: "https://www.youtube.com/watch?v=A1Ay22kNimk"
      },
      {
        title: "CapCut PC မြောင်းမာဆိုမှန်းအောင်ထပ်ပြောနည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=1ufb_okm-KE"
      },
      {
        title: "Computer နဲ့ video editing လုပ်နည်း​။ CapCut PC",
        youtubeUrl: ""
      },
      {
        title: "CapCut PC မြန်မာစာမှန်အောင်ထည့်နည်း",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Premiere Pro",
    skillName: "Premiere Pro",
    lessons: [
      {
        title: "EP 01 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: "https://www.youtube.com/watch?v=0Jwi7ffKLM8"
      },
      {
        title: "EP 02 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: "https://www.youtube.com/watch?v=iGJXmFU4rd8"
      },
      {
        title: "EP 03 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: "https://www.youtube.com/watch?v=qaD-ha-55QU"
      },
      {
        title: "EP 04 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: "https://www.youtube.com/watch?v=peRcsYfi7r4"
      }
    ]
  },
  {
    title: "Node.js/Express.js",
    skillName: "Node.js/Express.js",
    lessons: [
      {
        title: "Introduction",
        youtubeUrl: "https://www.youtube.com/watch?v=awI7KrBAjss"
      },
      {
        title: "What is V8 Engine",
        youtubeUrl: "https://www.youtube.com/watch?v=AsZ8A5Q4D4U"
      },
      {
        title: "Initial Requirement",
        youtubeUrl: "https://www.youtube.com/watch?v=Wj63sWR_oJY"
      },
      {
        title: "First App",
        youtubeUrl: "https://www.youtube.com/watch?v=C2W4_KQIGc0"
      },
      {
        title: "Global Methods",
        youtubeUrl: "https://www.youtube.com/watch?v=E3VXZ-dfVv0"
      }
    ]
  },
  {
    title: "Web Hosting",
    skillName: "Web Hosting",
    lessons: [
      {
        title: "Web Hosting တည်ဆောက်လိုရမှေကျမယ်",
        youtubeUrl: "https://www.youtube.com/watch?v=UCCgdRm-SFw"
      }
    ]
  },
  {
    title: "Database",
    skillName: "Database",
    lessons: [
      {
        title: "how to run MongoDB on a custom local host",
        youtubeUrl: "https://www.youtube.com/watch?v=QY8PA-LJPnU"
      },
      {
        title: "Enable authorization and add user & password in MongoDB",
        youtubeUrl: "https://www.youtube.com/watch?v=FtNIfaa4Icc"
      },
      {
        title: "Sing-in & Sing-up System using Tkinter GUI and MongoDB Database",
        youtubeUrl: "https://www.youtube.com/watch?v=BrqtKM_L3v8"
      },
      {
        title: "CRUD Operations in MongoDB",
        youtubeUrl: "https://www.youtube.com/watch?v=812b6zLtZL8"
      },
      {
        title: "Update & Delete Operator in MongoDB",
        youtubeUrl: "https://www.youtube.com/watch?v=Lo4Bj38Zkb8"
      }
    ]
  },
  {
    title: "PHP/Laravel",
    skillName: "PHP/Laravel",
    lessons: [
      {
        title: "PHP Introduction",
        youtubeUrl: "https://www.youtube.com/watch?v=9_EdsyebgGs"
      },
      {
        title: "PHP Section 2",
        youtubeUrl: "https://www.youtube.com/watch?v=N0sLCCtPvs4"
      },
      {
        title: "PHP Section 3",
        youtubeUrl: "https://www.youtube.com/watch?v=cgI1sBbNzzY"
      },
      {
        title: "PHP Section 4",
        youtubeUrl: "https://www.youtube.com/watch?v=gUKnYb4OC2o"
      },
      {
        title: "PHP Section 5 - Part 1",
        youtubeUrl: "https://www.youtube.com/watch?v=jVbXGxAmg7s"
      },
      {
        title: "PHP Section 5 Part 2",
        youtubeUrl: "https://www.youtube.com/watch?v=J33yCQIaSdQ"
      }
    ]
  },
  {
    title: "CSS",
    skillName: "CSS",
    lessons: [
      {
        title: "Cascading Style Sheets (CSS)",
        youtubeUrl: "https://www.youtube.com/watch?v=p5q1Ipp164Y"
      },
      {
        title: "External CSS",
        youtubeUrl: "https://www.youtube.com/watch?v=s0Se0NXROTQ"
      },
      {
        title: "Inline CSS, Cascading",
        youtubeUrl: "https://www.youtube.com/watch?v=wlNo7IXVHoA"
      },
      {
        title: "CSS selectors",
        youtubeUrl: "https://www.youtube.com/watch?v=BhhmXHNLhDE"
      },
      {
        title: "Installing Visual Studio Code (Mac & Windows)",
        youtubeUrl: "https://www.youtube.com/watch?v=vCExBJsOtB0"
      },
      {
        title: "CSS Box Model (Part 1)",
        youtubeUrl: "https://www.youtube.com/watch?v=yPvCFT61VEw"
      },
      {
        title: "CSS Box Model (Part 2)",
        youtubeUrl: "https://www.youtube.com/watch?v=KDi_-hI7w4A"
      }
    ]
  },
  {
    title: "JavaScript",
    skillName: "JavaScript",
    lessons: [
      {
        title: "JavaScript Introduction",
        youtubeUrl: "https://www.youtube.com/watch?v=Qj14NdWadaA"
      },
      {
        title: "Variables",
        youtubeUrl: "https://www.youtube.com/watch?v=ZOK4M8Z9x4s"
      },
      {
        title: "Operators",
        youtubeUrl: "https://www.youtube.com/watch?v=4wNLYvCJVmQ"
      },
      {
        title: "Conditional Statements (Part 1)",
        youtubeUrl: "https://www.youtube.com/watch?v=RzIIzvrnWls"
      },
      {
        title: "Logical Operators",
        youtubeUrl: "https://www.youtube.com/watch?v=UcFCRS3A-wQ"
      },
      {
        title: "Conditional Statements (Part 2)",
        youtubeUrl: "https://www.youtube.com/watch?v=wZ8SfAM-O_U"
      }
    ]
  },
  {
    title: "Laravel",
    skillName: "Laravel",
    lessons: [
      {
        title: "Project installing (Laravel CRUD)",
        youtubeUrl: "https://www.youtube.com/watch?v=uJv3l0M6xDk"
      },
      {
        title: "Connect to database (Laravel CRUD)",
        youtubeUrl: "https://www.youtube.com/watch?v=ZKifqZJDBco"
      },
      {
        title: "Migrating table and create model (Laravel CRUD)",
        youtubeUrl: "https://www.youtube.com/watch?v=ia7KZRO_uA4"
      },
      {
        title: "Create resource controller (Laravel CRUD)",
        youtubeUrl: "https://www.youtube.com/watch?v=gO8OKyr-Eio"
      },
      {
        title: "Learn about routes and return views",
        youtubeUrl: "https://www.youtube.com/watch?v=YOiPiy8iHtQ"
      }
    ]
  },
  {
    title: "HTML",
    skillName: "HTML",
    lessons: [
      {
        title: "Episode 1 - What is a website?",
        youtubeUrl: "https://www.youtube.com/watch?v=lFjMkUmp_lk"
      },
      {
        title: "Episode 2 - HTML Document",
        youtubeUrl: "https://www.youtube.com/watch?v=toToYvjScho"
      },
      {
        title: "Episode 3 - Create HTML Document",
        youtubeUrl: "https://www.youtube.com/watch?v=UOQaUrRQeDo"
      },
      {
        title: "Episode 4 - Most used HTML tags",
        youtubeUrl: "https://www.youtube.com/watch?v=ux2lp0OfkbU"
      },
      {
        title: "Episode 5 - Most used HTML tags",
        youtubeUrl: "https://www.youtube.com/watch?v=47K23Bo87mk"
      },
      {
        title: "Episode 6 - Most used HTML tags",
        youtubeUrl: "https://www.youtube.com/watch?v=fJRCg_nv9W4"
      },
      {
        title: "Episode 7 - Most used HTML tags",
        youtubeUrl: "https://www.youtube.com/watch?v=sW372LA4KPw"
      }
    ]
  },
  {
    title: "Google Workspace",
    skillName: "Google Workspace",
    lessons: [
      {
        title: "How to use Google Calendar (Basic)",
        youtubeUrl: "https://www.youtube.com/watch?v=oCCYg8kk_AI"
      },
      {
        title: "Google Calendar Time Blocking Guide (Computer)",
        youtubeUrl: "https://www.youtube.com/watch?v=VOiHmShRMfY"
      },
      {
        title: "How to Setup Appointment Slots in Google Calendar",
        youtubeUrl: "https://www.youtube.com/watch?v=XQRLutO3GAM"
      }
    ]
  },
  {
    title: "Excel",
    skillName: "Excel",
    lessons: [
      {
        title: "Microsoft Excel အပိုင်း ၁",
        youtubeUrl: "https://www.youtube.com/watch?v=fJ7-euukaSQ"
      },
      {
        title: "Microsoft Excel အပိုင်း ၂",
        youtubeUrl: "https://www.youtube.com/watch?v=PkIAwO93iFY"
      },
      {
        title: "Microsoft Excel အပိုင်း ၃",
        youtubeUrl: "https://www.youtube.com/watch?v=f6CnV3yb5iw"
      },
      {
        title: "Microsoft Excel အပိုင်း ၄",
        youtubeUrl: "https://www.youtube.com/watch?v=aIcm5I_tA9w"
      },
      {
        title: "Microsoft Excel အပိုင်း ၅",
        youtubeUrl: "https://www.youtube.com/watch?v=efdBzdYAmno"
      },
      {
        title: "How To Use Formulas In Microsoft Excel | Formula မျာ အသုံးပြုနည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=_2ej9bLc0hQ"
      },
      {
        title: "How To Use Formulas In Microsoft Excel | Formula များအသုံးပြုနည်း",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "PowerPoint",
    skillName: "PowerPoint",
    lessons: [
      {
        title: "လက်တွေ့ အသုံးချ PowerPoint သင်ကြားနည်း (၁)",
        youtubeUrl: "https://www.youtube.com/watch?v=Qi0u_ZCyY5U"
      },
      {
        title: "လက်တွေ့ အသုံးချ PowerPoint သင်ကြားနည်း (၂)",
        youtubeUrl: "https://www.youtube.com/watch?v=HkooJ2GdmBU"
      },
      {
        title: "Microsoft PowerPoint မှာ ဒုတိပြောင်ဆော် ဇယားကွက် ထည့်သွင်းနည်း (၂)",
        youtubeUrl: "https://www.youtube.com/watch?v=sR7wr-I8ctU"
      },
      {
        title: "Microsoft PowerPoint မှာ Text Box ဇယားကွက် အသုံးပြုနည်း | How to Add Text Box in PowerPoint",
        youtubeUrl: "https://www.youtube.com/watch?v=NOEWpjWC5QM"
      },
      {
        title: "PowerPoint တွင် Slide အသစ်ယူနည်း၊ Slide layout မျာ ပြောင်းနည်း၊ Slide မျာ ဖျက်နည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=eFxDV4SaFYU"
      },
      {
        title: "Microsoft PowerPoint မှာ Barcode ဇယားကွက် ပြုလုပ်နည်း | Create Barcode in Microsoft PowerPoint",
        youtubeUrl: "https://www.youtube.com/watch?v=09uWmvTFhOo"
      },
      {
        title: "လက်တွေ့အသုံးချ PowerPoint သင်ခန်းစာ (၁)",
        youtubeUrl: ""
      },
      {
        title: "လက်တွေ့အသုံးချ PowerPoint သင်ခန်းစာ (၂)",
        youtubeUrl: ""
      },
      {
        title: "Microsoft PowerPoint မှာ ဓါတ်ပုံများကို စနစ်တကျ ထည့်သွင်းအသုံးပြုနည်း (၂)",
        youtubeUrl: ""
      },
      {
        title: "Microsoft PowerPoint မှာ Text Box စနစ်တကျ အသုံးပြုနည်း | How to Add Text Box in PowerPoint",
        youtubeUrl: ""
      },
      {
        title: "PowerPoint တွင် Slide အသစ်ယူနည်း၊ Slide layout များပြောင်းလဲနည်း၊ Slide များကို စနစ်တကျ ဖျက်နည်း",
        youtubeUrl: ""
      },
      {
        title: "Microsoft PowerPoint မှာ Barcode စနစ်တကျ ပြုလုပ်နည်း | Create Barcode in Microsoft PowerPoint",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Microsoft Word",
    skillName: "Microsoft Word",
    lessons: [
      {
        title: "ကွမ်ပျူတာ အခြေခံသင်တန်း Basic Computer Part-2 Microsoft Word အပိုင်း ၁",
        youtubeUrl: "https://www.youtube.com/watch?v=6SYcoX9fj5w"
      },
      {
        title: "ကွမ်ပျူတာ အခြေခံသင်တန်း Basic Computer Part-3 Microsoft Word အပိုင်း ၂",
        youtubeUrl: "https://www.youtube.com/watch?v=y3fNoS6PYIY"
      },
      {
        title: "ကွမ်ပျူတာ အခြေခံသင်တန်း Basic Computer Part-4 Microsoft Word အပိုင်း ၃",
        youtubeUrl: "https://www.youtube.com/watch?v=MRffj-dqUu4"
      },
      {
        title: "ကွမ်ပျူတာ အခြေခံသင်တန်း Basic Computer Part-5 Microsoft Word အပိုင်း ၄",
        youtubeUrl: "https://www.youtube.com/watch?v=45i4gVUC7cA"
      },
      {
        title: "ကွမ်ပျူတာ အခြေခံသင်တန်း Basic Computer Part-6 Microsoft Word အပိုင်း ၅",
        youtubeUrl: "https://www.youtube.com/watch?v=B4obFvcDEk0"
      },
      {
        title: "Microsoft word တွင် Shortcut Key မျာ အသုံးပြုနည်း | All Shortcut Key in Microsoft word",
        youtubeUrl: "https://www.youtube.com/watch?v=p-B-CPeLa84"
      },
      {
        title: "အလုပ်လျှောက်ကလွှာ CV form ရေးနည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=m9f8H8_oXuI"
      },
      {
        title: "ဝန်ထမ်းကဒ် ပြုလုပ်နည်း | Microsoft word အသုံးပြုပြီး ဝန်ထမ်းကဒ် ပြုလုပ်နည်း | Microsoft word",
        youtubeUrl: "https://www.youtube.com/watch?v=EUZzUXxpQZ8"
      },
      {
        title: "Microsoft Word မှာ ဇယားကွက် ရုံးဝင်ဆာနည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=j1h-NuFgwHo"
      }
    ]
  },
  {
    title: "Internet & Email",
    skillName: "Internet & Email",
    lessons: [
      {
        title: "အင်တာနက် ကဘယ်လို ဖြစ်ချလာတာလဲ?",
        youtubeUrl: "https://www.youtube.com/watch?v=QwFNKFfC9KY"
      },
      {
        title: "အင်တာနက် အသုံးပြုနည်း အခြေခံ",
        youtubeUrl: "https://www.youtube.com/watch?v=s_j-DfK4Suw"
      },
      {
        title: "သင်ကြောင်းတော် အင်တာနက်မှာ အထာကျ ကျမယ်",
        youtubeUrl: "https://www.youtube.com/watch?v=DJT0-vKxZ7w"
      },
      {
        title: "Gmail ပိုနည်း သင်ကြားနည်း ပြောင်းဆိုဝင် | How to send Gmail",
        youtubeUrl: "https://www.youtube.com/watch?v=e3SADCKs4Ew"
      }
    ]
  },
  {
    title: "Computer Basics",
    skillName: "Computer Basics",
    lessons: [
      {
        title: "How Computers Work? ကွမ်ပျူတာ ဘယ်လို ဖြစ်ချလုပ်ချလဲ?",
        youtubeUrl: "https://www.youtube.com/watch?v=0BGJrXDXm-U"
      },
      {
        title: "Computer Hardware ဆိုတာဘာလဲ? (အစိတ်အပိုင်းမျာ အသေးစိတ်ရှင်းပြချက်)",
        youtubeUrl: "https://www.youtube.com/watch?v=HaluUiqtZ6o"
      },
      {
        title: "Software ဆိုတာဘာလဲ? (System Software နဲ့ Application Software ကွာခြားချက်)",
        youtubeUrl: "https://www.youtube.com/watch?v=Qd_6JXZVA9s"
      },
      {
        title: "Window 11 အသုံးပြုနည်း အခြေခံ အပိုင်း ၁",
        youtubeUrl: "https://www.youtube.com/watch?v=O5ssosle2hM"
      },
      {
        title: "Window 11 အသုံးပြုနည်းအခြေခံ အပိုင်း ၂",
        youtubeUrl: "https://www.youtube.com/watch?v=Y5-pMaKBklo"
      }
    ]
  },
  {
    title: "Basic Photoshop",
    skillName: "Basic Photoshop",
    lessons: [
      {
        title: "Beginner Level For Social Media Ads Design Creation (Beginner Graphic Design Course)",
        youtubeUrl: "https://www.youtube.com/watch?v=V-9s5VjkBdk"
      },
      {
        title: "Transform For Photoshop Tutorial",
        youtubeUrl: "https://www.youtube.com/watch?v=R4qNFbgPpOw"
      },
      {
        title: "Free To Use Shutterstock Image",
        youtubeUrl: "https://www.youtube.com/watch?v=tnZ87fLXN2Q"
      },
      {
        title: "How to make gold effect in photoshop",
        youtubeUrl: "https://www.youtube.com/watch?v=I7_BQZuNr9Y"
      },
      {
        title: "ဖုန်းနဲ့ ဓာတ်ပုံ ရိုက်ပြီး Product Retouch ဘယ်လို လုပ်မလဲ?",
        youtubeUrl: "https://www.youtube.com/watch?v=pP3JVyZyxms"
      },
      {
        title: "Design knowledge",
        youtubeUrl: "https://www.youtube.com/watch?v=ppkHrtuX7X8"
      },
      {
        title: "3D Text Effect For Adobe Photoshop",
        youtubeUrl: "https://www.youtube.com/watch?v=CBhUnr-WORo"
      },
      {
        title: "How To Use Pentool?",
        youtubeUrl: "https://www.youtube.com/watch?v=svePSwnlofg"
      },
      {
        title: "Page အတွက် ပြောင်းနည်း တဲ့ Album post size",
        youtubeUrl: "https://www.youtube.com/watch?v=Z2yRbu2_8J8"
      },
      {
        title: "Food Banner Design In Photoshop",
        youtubeUrl: "https://www.youtube.com/watch?v=9l-e-ef4OeU"
      },
      {
        title: "How to use clipping mask for adobe photoshop",
        youtubeUrl: "https://www.youtube.com/watch?v=5H4_bGX4xCg"
      },
      {
        title: "ကိုယ့် Design Skill ကို လိုချင် level ထိ ပြောင်းသွားတတ် Headphone Poster Design",
        youtubeUrl: "https://www.youtube.com/watch?v=CURCwaPSRTI"
      },
      {
        title: "LOGO, Brand, Branding နဲ့ Brand Identity တို့ရဲ့ မတူညီတဲ့ ကွာခြားချက်",
        youtubeUrl: "https://www.youtube.com/watch?v=1rLVounBiOM"
      },
      {
        title: "ဒီ Video ကြည့်ပြီး Design မှာ အရိပ်ချတာ (Shadow Effect) ကျွမ်းကျင်ပြီ! | Burger Ads Design",
        youtubeUrl: "https://www.youtube.com/watch?v=c47p9ohQi5s"
      },
      {
        title: "ဒီ video ကြည့်ပြီး တာ Social Media Design တွင် ကိုကျွမ်းကျင်ဆန်ဆိုပြီး Photoshop Tutorial",
        youtubeUrl: "https://www.youtube.com/watch?v=BPIkuoAm3C8"
      }
    ]
  },
  {
    title: "Typography",
    skillName: "Typography",
    lessons: [
      {
        title: "Typography ဆိုတာဘာလဲ? Typeface နဲ့ Font ကွာခြားချက်",
        youtubeUrl: "https://www.youtube.com/watch?v=sByzHoiYFX0"
      },
      {
        title: "TYPOGRAPHY BASIC အကြောင်းလေ့လာကြမယ်။",
        youtubeUrl: ""
      },
      {
        title: "Understanding Typography/ စကားပြောသော ဖောင့်ဒီဇိုင်းများ",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Color Theory",
    skillName: "Color Theory",
    lessons: [
      {
        title: "Color Theory အခြေခံ နှင့် Design တွင် အရောင်အသုံးပြုနည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=GyVMK5n-R-c"
      }
    ]
  },
  {
    title: "Adobe Illustrator",
    skillName: "Adobe Illustrator",
    lessons: [
      {
        title: "Adobe Illustrator CC အခြေခံ အသုံးပြုနည်း သင်ခန်းစာ ၁",
        youtubeUrl: "https://www.youtube.com/watch?v=7_pM4tDq3l0"
      }
    ]
  },
  {
    title: "Branding",
    skillName: "Branding",
    lessons: [
      {
        title: "Branding ဆိုတာဘာလဲ? Brand Identity တည်ဆောက်ခြင်း",
        youtubeUrl: "https://www.youtube.com/watch?v=1rLVounBiOM"
      },
      {
        title: "Logotype တစ်ခု ဘယ်လို လုပ်မလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Brand, Branding, Brand Identity ကို နားလည်ကြစေဖို့",
        youtubeUrl: ""
      },
      {
        title: "BRAND'S DNA ဆိုတာ ဘာလဲ။",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "CV & Portfolio Building",
    skillName: "CV & Portfolio Building",
    lessons: [
      {
        title: "Professional CV Form နှင့် Portfolio တည်ဆောက်နည်း",
        youtubeUrl: "https://www.youtube.com/watch?v=m9f8H8_oXuI"
      }
    ]
  },
  {
    title: "Agentic AI",
    skillName: "Agentic AI",
    lessons: [
      {
        title: "Best way to learn Agentic AI",
        youtubeUrl: ""
      },
      {
        title: "Telegram Bot and n8n ချိတ်ဆက် ၊ AI Agents များကို Telegram ကနေ ခိုင်းစေခြင်း | Agentic AI Myanmar",
        youtubeUrl: ""
      },
      {
        title: "Agentic AI: အနာဂတ်ရဲ့ ဦးဆောင်သူ? (Agentic AI: The Future Leader?)",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "ChatGPT",
    skillName: "ChatGPT",
    lessons: [
      {
        title: "What is AI?",
        youtubeUrl: ""
      },
      {
        title: "chat gpt အသုံးပြုနည်း",
        youtubeUrl: ""
      },
      {
        title: "ChatGPT x Canva တွဲသုံးနည်း",
        youtubeUrl: ""
      },
      {
        title: "AI သုံးပြီး Assignment ဘယ်လိုရေးမလည်း",
        youtubeUrl: ""
      },
      {
        title: "ကျွန်တော်ငတတ်ပြားဂိမ်းကို Chatgpt Ai ကိုရေးခိုင်းခဲ့တယ်",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Prompt",
    skillName: "Prompt",
    lessons: [
      {
        title: "လူတိုင်း အတွက် AI ကို ခိုင်းနည်း။ (AI Prompting)",
        youtubeUrl: ""
      },
      {
        title: "Prompt Engineering 1",
        youtubeUrl: ""
      },
      {
        title: "Prompt Engineering 2",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Generative AI",
    skillName: "Generative AI",
    lessons: [
      {
        title: "AI ကို အလွယ်ကူဆုံး လေ့လာမယ် (ChatGPT, Claude, Deepseek) ဘာတွေကွာလဲ?",
        youtubeUrl: ""
      },
      {
        title: "AI သုံးပြီး ဝင်ငွေရှာ/ လုပ်ငန်းတစ်ခုစတင် ခြင်း",
        youtubeUrl: ""
      },
      {
        title: "Gemini enterprise နဲ့ AI video တွေကို free ထုတ်လို့ရနေပြီ | How to generate AI videos for free",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Data Visualization",
    skillName: "Data Visualization",
    lessons: [
      {
        title: "PowerBI Dashboard Design ဆွဲတဲ့အခါမှာ မဖြစ်နေ သိရမယ့် အချက် ၁၃ ချက်",
        youtubeUrl: ""
      },
      {
        title: "PowerBI Reports တွေမှာ Toggle Button အသုံးပြုပြီး Theme Design style change နည်း",
        youtubeUrl: ""
      },
      {
        title: "Making bar and line charts in PoweBI",
        youtubeUrl: ""
      },
      {
        title: "Making Pie Chart, Treemap, Slice in  PowerBI",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "PowerBI",
    skillName: "PowerBI",
    lessons: [
      {
        title: "Beginner Guide to Power BI - Part 1",
        youtubeUrl: ""
      },
      {
        title: "Beginner Guide to Power BI - Part 2",
        youtubeUrl: ""
      },
      {
        title: "Building Power BI report from Excel - Part 1",
        youtubeUrl: ""
      },
      {
        title: "Building Power BI report from Excel - Part 2",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Production",
    skillName: "Production",
    lessons: []
  },
  {
    title: "Hook",
    skillName: "Hook",
    lessons: [
      {
        title: "Content Writer တစ်ယောက်ဖြစ်အောင် ဘယ်လိုလေ့လာရမလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Content တစ်ပုဒ်ကို Step-by-Step ဘယ်လိုရေးကြမလဲ",
        youtubeUrl: ""
      },
      {
        title: "Content Writing Skills တိုးတက်အောင် ဘယ်လိုလုပ်မလဲ?",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Algorithms",
    skillName: "Algorithms",
    lessons: [
      {
        title: "Data Structures and Algorithms မိတ်ဆက်",
        youtubeUrl: ""
      },
      {
        title: "Algorithm ဆိုတာ ဘာလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Data Structure ဆိုတာဘာလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Array ဆိုတာ ဘာလဲ?",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Python",
    skillName: "Python",
    lessons: [
      {
        title: "1. ဘာလို့ python လေ့လာသင့်တာလဲ - Beginner Python Programming",
        youtubeUrl: ""
      },
      {
        title: "2. Programming language သဘောတရား နဲ့ Python Install လုပ်မယ်",
        youtubeUrl: ""
      },
      {
        title: "3. Python Code တွေကို ဘယ်မှာ ရေးမလဲ",
        youtubeUrl: ""
      },
      {
        title: "4. Variable များအကြောင်း",
        youtubeUrl: ""
      },
      {
        title: "5. ကိန်းဂဏန်းဆိုင်ရာ data များ (Numeric type",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Java",
    skillName: "Java",
    lessons: [
      {
        title: "Java install တင်နည်း",
        youtubeUrl: ""
      },
      {
        title: "Java ဘယ်လို အလုပ်လုပ်တာလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Object-oriented programming (OOP) ဆိုတာ ဘာလဲ? OOP Lesson 1",
        youtubeUrl: ""
      },
      {
        title: "Inheritance အကြောင်း - OOP Lesson 2",
        youtubeUrl: ""
      },
      {
        title: "Hello World! - မင်းရဲ့ ပထမဆုံး Java Program",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Github",
    skillName: "Github",
    lessons: [
      {
        title: "git နဲ့ GitHub ၁ နာရီခွဲဆို လုံလောက်ပြီ | Version Management System",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Prototype",
    skillName: "Prototype",
    lessons: [
      {
        title: "Client တွေလိုအပ်မယ့် Design ကောင်း/ System ကောင်းဘယ်လိုဖန်တီးမလဲ?",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "UI",
    skillName: "UI",
    lessons: [
      {
        title: "UI/ UX ဆိုတာဘာလဲနှင့် UI အတွက်သုံးသင့်သော Tools များ",
        youtubeUrl: ""
      },
      {
        title: "UI Design ဘယ်လိုစလေ့ကျင့်ရမလဲ",
        youtubeUrl: ""
      },
      {
        title: "သူများဆွဲထားတဲ့ UI Design ကိုဘယ်လိုအတုယူရမလဲ",
        youtubeUrl: ""
      },
      {
        title: "သူများဆွဲထားတဲ့ Web Design အတုယူနည်း (02",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "UX",
    skillName: "UX",
    lessons: [
      {
        title: "User-Centred Design ဆိုတာဘာလဲ",
        youtubeUrl: ""
      },
      {
        title: "Cognitive Load in UX",
        youtubeUrl: ""
      },
      {
        title: "UX မှာ Tool တွေထက် Thinking က ဘာလို့ ပိုအရေးကြီးတာလဲ",
        youtubeUrl: ""
      },
      {
        title: "UX Designer တစ်ယောက်လို ဘယ်လိုစဉ်းစားကြမလဲ",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Figma",
    skillName: "Figma",
    lessons: [
      {
        title: "Learning Figma Part 1",
        youtubeUrl: ""
      },
      {
        title: "Learning Figma Part 2",
        youtubeUrl: ""
      },
      {
        title: "Learning Figma Part 3",
        youtubeUrl: ""
      },
      {
        title: "Learning Figma Part 4",
        youtubeUrl: ""
      },
      {
        title: "Learning Figma Part 5",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Design",
    skillName: "Design",
    lessons: []
  },
  {
    title: "Portfolio",
    skillName: "Portfolio",
    lessons: [
      {
        title: "portfolio ကောင်းတစ်ခုကိုဘယ်လိုဖန်တီးမလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Portfolio ဆိုတာ ဘာလဲ? ဘယ်လိုလုပ်ရမလဲ?",
        youtubeUrl: ""
      },
      {
        title: "အလုပ်လျှောက်ဖို့ Portfolio ရှိပြီလား?",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "AdobeIllustrator",
    skillName: "AdobeIllustrator",
    lessons: [
      {
        title: "Adobe Illustrator Basics - Myanmar, Workspace, New File, Artboards",
        youtubeUrl: ""
      },
      {
        title: "Adobe Illustrator Basics - Myanmar, Pathfinder, Shade Builder & Pen Tool",
        youtubeUrl: ""
      },
      {
        title: "Adobe Illustrator Basics - Myanmar, Colors, Swatches & Gradients",
        youtubeUrl: ""
      },
      {
        title: "Adobe Illustrator Basics - Myanmar, Working with Text & Fonts",
        youtubeUrl: ""
      },
      {
        title: "Adobe Illustrator Basics - Myanmar, Layers, Groups & Organization",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "ColorTheory",
    skillName: "ColorTheory",
    lessons: [
      {
        title: "အရောင်တွေအကြောင်း",
        youtubeUrl: ""
      },
      {
        title: "အရောင်တွေကို ဘယ်လို အသုံးချမလဲ",
        youtubeUrl: ""
      },
      {
        title: "ဒီဇိုင်နာတိုင်းသိသင့်တဲ့ Color Theory",
        youtubeUrl: ""
      },
      {
        title: "Graphic Designer ဖြစ်ချင်သူတိုင်းသိထားသင့်တယ့် Color Theory အကြောင်း | RGB & CMYK ဆိုတာဘာလဲ ?",
        youtubeUrl: ""
      },
      {
        title: "အရောင်တွေကို တကယ် နားလည်ရဲ့လား",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "PerformanceMarketing",
    skillName: "PerformanceMarketing",
    lessons: [
      {
        title: "Storytelling ဘယ်လိုလုပ်ကြမလဲ?",
        youtubeUrl: ""
      },
      {
        title: "Business Branding လား Personal Branding လား",
        youtubeUrl: ""
      },
      {
        title: "၂၀၂၆ မှာ ပြောင်းလဲလာတဲ့ Facebook Boosting/ Ads အကြောင်း",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "EmailMarketing",
    skillName: "EmailMarketing",
    lessons: [
      {
        title: "Email Content အကြောင်း",
        youtubeUrl: ""
      },
      {
        title: "Email Marketing တစ်စောင်ဖန်တီးနည်း",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "SocialMedia",
    skillName: "SocialMedia",
    lessons: [
      {
        title: "Social Media Content အကြောင်",
        youtubeUrl: ""
      },
      {
        title: "Social Media မှာ Post တင်ဖို့ Content ဖန်တီးနည်း ၂၁ နည်း",
        youtubeUrl: ""
      },
      {
        title: "Content Marketing အတွက် မသိမဖြစ်Digital Toolများ(",
        youtubeUrl: ""
      },
      {
        title: "Content creationအတွက် ထိရောက်တဲ့Hashtag များရှာနည်း(",
        youtubeUrl: ""
      },
      {
        title: "Facebook Marketing ဆိုတာဘာလဲ",
        youtubeUrl: ""
      },
      {
        title: "Facebook Marketing & Management အတွက် အသုံး၀င်သော Applicationများ",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "ContentMarketing",
    skillName: "ContentMarketing",
    lessons: [
      {
        title: "Marketing ဆိုတာဘာလဲ",
        youtubeUrl: ""
      },
      {
        title: "Content ဆိုတာဘာလဲ",
        youtubeUrl: ""
      },
      {
        title: "Content Marketing ဆိုတာ",
        youtubeUrl: ""
      },
      {
        title: "Content Marketing Strategy ချနည်း",
        youtubeUrl: ""
      },
      {
        title: "Content Goal/ Objective ချမှတ်ခြင်း",
        youtubeUrl: ""
      },
      {
        title: "Content Goalနဲ့ကိုက်ညီတဲ့Target Audienceတွေကို ဘယ်လိုသတ်မှတ်မလဲ။",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "SEO",
    skillName: "SEO",
    lessons: [
      {
        title: "SEO/ SEM ဆိုတာ What is SEO? What is SEM?",
        youtubeUrl: ""
      },
      {
        title: "SEO/ SEM အကြောင်း ဘာတွေသိထားသင့်လဲ?",
        youtubeUrl: ""
      },
      {
        title: "SEO ဆိုတာဘာလဲ၊ SEO အလုပ်လုပ် ချင်သူများကြည့်ရန်",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Prompting & Motion",
    skillName: "Prompting & Motion",
    lessons: [
      {
        title: "Kling AI သုံးပြီးအလန်းစားဗီဒီယိုတွေ ဖန်တီးမယ်",
        youtubeUrl: ""
      },
      {
        title: "ခေတ်စားနေတဲ့ Kling Ai အသုံးပြုနည်း အပြည့်အစုံ(full tutorial)",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "AfterEffects",
    skillName: "AfterEffects",
    lessons: [
      {
        title: "The best way to learn After Effects",
        youtubeUrl: ""
      },
      {
        title: "Adobe After Effects ကို မိနစ် 30 အတွင်းလေ့လာကြမယ်[ After Effects Myanmar ]",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Premiere",
    skillName: "Premiere",
    lessons: [
      {
        title: "EP 01 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: ""
      },
      {
        title: "EP 02 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: ""
      },
      {
        title: "EP 03 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: ""
      },
      {
        title: "EP 04 | အခြေခံ Video Editing | Premiere Pro - latest",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Node",
    skillName: "Node",
    lessons: [
      {
        title: "Introduction",
        youtubeUrl: ""
      },
      {
        title: "What is V8 Engine",
        youtubeUrl: ""
      },
      {
        title: "Initial Requirement",
        youtubeUrl: ""
      },
      {
        title: "First App YouTube",
        youtubeUrl: ""
      },
      {
        title: "Global Methods YouTube",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "webhost",
    skillName: "webhost",
    lessons: [
      {
        title: "Web Hosting တစ်ခုဘယ်လိုရွေးချယ်မလဲ<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/UCCgdRm-SFw?si=xTCTY0QBlBMTylmC\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "PHP",
    skillName: "PHP",
    lessons: [
      {
        title: "PHP Introduction",
        youtubeUrl: ""
      },
      {
        title: "PHP Section 2",
        youtubeUrl: ""
      },
      {
        title: "PHP Section 3",
        youtubeUrl: ""
      },
      {
        title: "PHP Section 4",
        youtubeUrl: ""
      },
      {
        title: "PHP Section 5 - Part 1",
        youtubeUrl: ""
      },
      {
        title: "PHP Section 5 Part 2",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "JS",
    skillName: "JS",
    lessons: [
      {
        title: "JavaScript Introduction",
        youtubeUrl: ""
      },
      {
        title: "Variables",
        youtubeUrl: ""
      },
      {
        title: "Operators",
        youtubeUrl: ""
      },
      {
        title: "Conditional Statements (Part 1)",
        youtubeUrl: ""
      },
      {
        title: "Logical Operators",
        youtubeUrl: ""
      },
      {
        title: "Conditional Statements (Part 2)",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "GoogleWorkspace",
    skillName: "GoogleWorkspace",
    lessons: [
      {
        title: "How to use Google Calendar (Basic)",
        youtubeUrl: ""
      },
      {
        title: "Google Calendar Time Blocking Guide (Computer)",
        youtubeUrl: ""
      },
      {
        title: "How to Setup Appointment Slots in Google Calendar",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Word",
    skillName: "Word",
    lessons: [
      {
        title: "ကွန်ပျူတာ အ‌‌‌ခြေခံသင်တန်း Basic Computer Part-2 Microsoft Word အပိုင်း ၁",
        youtubeUrl: ""
      },
      {
        title: "ကွန်ပျူတာ အ‌‌‌ခြေခံသင်တန်း Basic Computer Part-3 Microsoft Word အပိုင်း ၂",
        youtubeUrl: ""
      },
      {
        title: "ကွန်ပျူတာ အ‌‌‌ခြေခံသင်တန်း Basic Computer Part-4 Microsoft Word အပိုင်း ၃",
        youtubeUrl: ""
      },
      {
        title: "ကွန်ပျူတာ အ‌‌‌ခြေခံသင်တန်း Basic Computer Part-5 Microsoft Word အပိုင်း ၄",
        youtubeUrl: ""
      },
      {
        title: "ကွန်ပျူတာ အ‌‌‌ခြေခံသင်တန်း Basic Computer Part-6 Microsoft Word အပိုင်း ၅",
        youtubeUrl: ""
      },
      {
        title: "Microsoft word တွင် Shortcut Key များအသုံးပြုနည်း | All Shortcut Key in Microsoft word",
        youtubeUrl: ""
      },
      {
        title: "အလုပ်လျှောက်လွှာ CV form ရေးနည်း",
        youtubeUrl: ""
      },
      {
        title: "ဝန်ထမ်းကဒ်ပြုလုပ်နည်း | Microsoft word အသုံးပြုပြီး ဝန်ထမ်းကဒ်အလွယ်ပြုလုပ်နည်း | Microsoft word",
        youtubeUrl: ""
      },
      {
        title: "Microsoft Word မှာ စနစ်တကျ ရုံးစာရိုက်နည်း",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Internet&Email",
    skillName: "Internet&Email",
    lessons: [
      {
        title: "အင်တာနက် ကဘယ်လိုဖြစ်လာတာလဲ?\"",
        youtubeUrl: ""
      },
      {
        title: "အင်တာနက် အသုံးပြုနည်း အခြေခံ",
        youtubeUrl: ""
      },
      {
        title: "သိချင်တာတွေ အင်တာနက်မှာ အထာကျကျရှာကြမယ်",
        youtubeUrl: ""
      },
      {
        title: "Gmail ပို့နည်း သင်ခန်းစာအပြည့်အစုံ | How to send Gmail",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "computerbasic",
    skillName: "computerbasic",
    lessons: [
      {
        title: "How Computers Work? ကွန်ပျူတာ ဘယ်လိုအလုပ်လုပ်လဲ?",
        youtubeUrl: ""
      },
      {
        title: "Computer Hardware ဆိုတာဘာလဲ? (အစိတ်အပိုင်းများကို အသေးစိတ်ရှင်းပြချက်)",
        youtubeUrl: ""
      },
      {
        title: "Software ဆိုတာဘာလဲ? (System Software နဲ့ Application Software ကွာခြားချက်)",
        youtubeUrl: ""
      },
      {
        title: "Window 11 အသုံးပြုနည်း အခြေခံ အပိုင်း ၁",
        youtubeUrl: ""
      },
      {
        title: "Window 11 အသုံးပြုနည်းအခြေခံ အပိုင်း ၂",
        youtubeUrl: ""
      }
    ]
  },
  {
    title: "Photoshop",
    skillName: "Photoshop",
    lessons: [
      {
        title: "Beginner Level For Social Media Ads Design Creation ( Beginner Graphic Design Course )",
        youtubeUrl: ""
      },
      {
        title: "Transform For Photoshop Tutorial",
        youtubeUrl: ""
      },
      {
        title: "Free To Use Sutterstock Image",
        youtubeUrl: ""
      },
      {
        title: "How to make gold effect in photoshop",
        youtubeUrl: ""
      },
      {
        title: "ဖုန်းနဲ့ဓာတ်ပုံရိုက်ပြီးProduct Retouchဘယ်လိုလုပ်မလဲ?",
        youtubeUrl: ""
      },
      {
        title: "design knowledge",
        youtubeUrl: ""
      },
      {
        title: "3D Text Effect For Adobe Photoshop",
        youtubeUrl: ""
      },
      {
        title: "How To Use Pentool ?",
        youtubeUrl: ""
      },
      {
        title: "Pageအတွက် ပြောင်းလဲသွားတဲ့ Album post size",
        youtubeUrl: ""
      },
      {
        title: "Food Banner Design In Photoshop",
        youtubeUrl: ""
      },
      {
        title: "How to use clipping mask for adobe photoshop",
        youtubeUrl: ""
      },
      {
        title: "ကိုယ့်Design Skillကို လက်ရှိlevelထက်ပိုမြှင့်တင်မယ် Headphone Poster Design",
        youtubeUrl: ""
      },
      {
        title: "LOGO, Brand, Branding နဲ့ Brand Identity တိုရဲ့ မတူညီတဲ့ ကွာခြားချက်များ",
        youtubeUrl: ""
      },
      {
        title: "ဒီ Video ကြည့်ပြီးရင် Design မှာ အရိပ်ချတာ (Shadow Effect) ကျွမ်းကျင်ပြီ! | Burger Ads Design",
        youtubeUrl: ""
      },
      {
        title: "ဒီvideo ကြည့်ပြီးတာနဲ့ Social Media Design တွေကို ကျွမ်းကျင်စွာဖန်တီးနိုင်ပြီ-Photoshop Tutorial",
        youtubeUrl: ""
      }
    ]
  }
];

// ── Category icon map ────────────────────────────────────────────────
const CATEGORY_ICONS = {
  "Foundation Skills":     "💻",
  "Graphic Design Skills": "🎨",
  "Web":                   "🌐",
  "Video Editing":         "🎬",
  "Marketing":             "📢",
  "Content Creation":      "✍️",
  "AI Skills":             "🤖",
  "Data Analyst Skills":   "📊",
  "Cybersecurity":         "🔐",
  "Freelancing & Career":  "💼",
};

// ── Helpers ──────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Main seed function ───────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── 1. Get or create system admin user (needed for roadmap.created_by) ──
    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'admin', description: 'Admin role', permissions: ['all'] });
      console.log('Created admin role');
    }

    let systemUser = await User.findOne({ username: 'system_seed' });
    if (!systemUser) {
      systemUser = await User.create({
        full_name: 'System Seed',
        username: 'system_seed',
        email: 'system_seed@lanpya.local',
        password_hash: 'Seed@12345!',
        role_id: adminRole._id,
        email_verified: true,
      });
      console.log('Created system_seed user');
    }

    // ── 2. Seed Categories ──────────────────────────────────────────
    const categoryNames = [...new Set(SKILLS_DATA.map(s => s.category))];
    const categoryMap = {}; // name → _id

    for (const name of categoryNames) {
      const slug = slugify(name);
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({
          name,
          slug,
          icon: CATEGORY_ICONS[name] || '📌',
        });
        console.log(`  + Category: ${name}`);
      } else {
        console.log(`  ~ Category exists: ${name}`);
      }
      categoryMap[name] = cat._id;
    }

    // ── 3. Seed Skills ──────────────────────────────────────────────
    const skillMap = {}; // "name" → _id  (normalised name for lookup)

    for (const s of SKILLS_DATA) {
      const normName = s.name.trim();
      const cat_id   = categoryMap[s.category];
      let skill = await Skill.findOne({ name: normName, category_id: cat_id });
      if (!skill) {
        skill = await Skill.create({ category_id: cat_id, name: normName });
        console.log(`    + Skill: ${normName}`);
      } else {
        console.log(`    ~ Skill exists: ${normName}`);
      }
      skillMap[normName.toLowerCase()] = skill._id;
    }

    // ── 4. Seed Roadmaps → Modules → Lessons → LessonResources ─────
    for (const course of COURSES_DATA) {
      const normSkill = course.skillName.trim();

      // Find matching skill (look by skill name)
      const skillId = skillMap[normSkill.toLowerCase()];
      if (!skillId) {
        console.warn(`  ⚠ Skill not found for course: "${course.title}"`);
        continue;
      }

      // Find category_id via the skill
      const skill = await Skill.findById(skillId);
      const category_id = skill.category_id;

      // Roadmap: one per skill (upsert-style)
      let roadmap = await Roadmap.findOne({ title: normSkill });
      const currentThumb = ROADMAP_THUMBNAILS[normSkill.toLowerCase()] || "";
      if (!roadmap) {
        roadmap = await Roadmap.create({
          category_id,
          created_by: systemUser._id,
          title: normSkill,
          description: `${normSkill} လေ့လာရန် လမ်းညွှန် (Roadmap)`,
          difficulty: 'beginner',
          thumbnail: currentThumb,
          is_public: true,
        });
        console.log(`  + Roadmap: ${normSkill}`);
      } else {
        // Update description for existing ones to remove the Burmese template text
        roadmap.description = `${normSkill} လေ့လာရန် လမ်းညွှန် (Roadmap)`;
        roadmap.thumbnail = currentThumb;
        await roadmap.save();
        console.log(`  ~ Roadmap exists and updated description/thumbnail: ${normSkill}`);
      }

      // Module: one per course title (group of lessons)
      let mod = await Module.findOne({ roadmap_id: roadmap._id, title: course.title });
      if (!mod) {
        mod = await Module.create({
          roadmap_id: roadmap._id,
          title: course.title,
          description: `${course.title} သင်ကြားနည်း module`,
          module_order: 1,
        });
        console.log(`    + Module: ${course.title}`);
      } else {
        console.log(`    ~ Module exists: ${course.title}`);
      }

      // Lessons + LessonResources
      for (let i = 0; i < course.lessons.length; i++) {
        const lData = course.lessons[i];
        const lessonTitle = lData.title.trim();

        let lesson = await Lesson.findOne({ module_id: mod._id, title: lessonTitle });
        if (!lesson) {
          lesson = await Lesson.create({
            module_id: mod._id,
            title: lessonTitle,
            lesson_order: i + 1,
            is_preview: i === 0, // first lesson is preview
          });
          console.log(`      + Lesson ${i+1}: ${lessonTitle.substring(0, 60)}...`);
        } else {
          console.log(`      ~ Lesson exists: ${lessonTitle.substring(0, 60)}`);
        }

        // LessonResource (youtube video)
        const resourceUrl = lData.youtubeUrl || "#";
        const existingResource = await LessonResource.findOne({ lesson_id: lesson._id, url: resourceUrl });
        if (!existingResource) {
          await LessonResource.create({
            lesson_id: lesson._id,
            title: lessonTitle,
            type: 'video',
            url: resourceUrl,
          });
        }
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
