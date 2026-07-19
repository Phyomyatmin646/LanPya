const fs = require('fs');

async function run() {
  const seedFile = './Backend/seed_data.js';
  let seedText = fs.readFileSync(seedFile, 'utf8');

  // Extract old SKILLS_DATA
  const skillsMatch = seedText.match(/const SKILLS_DATA = (\[[\s\S]*?\]);\n\n\/\/ ── Courses \/ Lessons Data/);
  // Extract old COURSES_DATA
  const coursesMatch = seedText.match(/const COURSES_DATA = (\[[\s\S]*?\]);\n\n\/\/ ── Category icon map/);

  if (!skillsMatch || !coursesMatch) {
    console.error("Could not find arrays");
    process.exit(1);
  }

  let oldSkills = eval(skillsMatch[1]);
  let oldCourses = eval(coursesMatch[1]);

  const newSkillsRaw = JSON.parse(fs.readFileSync('/Users/aungsiphyo/Downloads/skills (1).json', 'utf8'));
  const newCoursesRaw = JSON.parse(fs.readFileSync('/Users/aungsiphyo/Downloads/courses(1).json', 'utf8'));

  // Merge Skills
  const mergedSkills = [...oldSkills];
  for (const ns of newSkillsRaw) {
    const cat = ns['Category'];
    const name = (ns['Skill / Topic'] || "").trim();
    if (!cat || !name) continue;
    const exists = mergedSkills.find(s => s.category.toLowerCase() === cat.toLowerCase() && s.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      mergedSkills.push({ category: cat, name: name });
    }
  }

  // Merge Courses
  const mergedCourses = [...oldCourses];
  for (const nc of newCoursesRaw) {
    const title = (nc.title || "").trim();
    if (!title) continue;

    let existingCourse = mergedCourses.find(c => c.skillName.toLowerCase() === title.toLowerCase() || c.title.toLowerCase() === title.toLowerCase());
    
    if (!existingCourse) {
      existingCourse = {
        title: title,
        skillName: title,
        lessons: []
      };
      mergedCourses.push(existingCourse);
    }

    for (const nl of nc.lessons) {
      const lessonTitle = (nl.title || "").trim();
      if (!lessonTitle) continue;

      const existingLesson = existingCourse.lessons.find(l => l.title.toLowerCase() === lessonTitle.toLowerCase());
      if (existingLesson) {
        // Keep old url if it exists, otherwise update
        if (!existingLesson.youtubeUrl && nl.youtubeUrl) {
          existingLesson.youtubeUrl = nl.youtubeUrl;
        }
      } else {
        existingCourse.lessons.push({
          title: lessonTitle,
          youtubeUrl: nl.youtubeUrl || ""
        });
      }
    }
  }

  const newSkillsStr = JSON.stringify(mergedSkills, null, 2).replace(/"([^"]+)":/g, '$1:');
  const newCoursesStr = JSON.stringify(mergedCourses, null, 2).replace(/"([^"]+)":/g, '$1:');

  seedText = seedText.replace(skillsMatch[1], newSkillsStr);
  seedText = seedText.replace(coursesMatch[1], newCoursesStr);

  fs.writeFileSync(seedFile, seedText, 'utf8');
  console.log("Merge successful");
}

run();
