// Alumni page data. Edit here; the page renders entirely from this file.
//
// PUBLISHING
//   confirmed            true once the person has personally okayed appearing on the public site.
//   PREVIEW_UNCONFIRMED  true shows everyone (unconfirmed cards get a PENDING tag) for review.
//                        Set to false before launch: only `confirmed: true` people are then
//                        published. The page never imports this file directly; vite.config.js
//                        reads it at build time and passes on only the visible entries, so
//                        unconfirmed names don't reach the shipped JavaScript either.
//   displayName          when set, it is the only name that is rendered or shipped.
//
// Empty `role`, `major`, `summary`, `advice` or `photo`, or `yearsOnTeam: null`, fall back
// cleanly on the page. Leave them empty until the person supplies them.

export const PREVIEW_UNCONFIRMED = true

// logo: path to the official seal under public/colleges/ (e.g. '/colleges/ut-austin.svg'). It is shown
//       unaltered, scaled to fit a neutral plate. Empty = the school's initials as plain text.
//       Current seals: each university's seal SVG as published on its English Wikipedia article.
// monogram: optional initials for that text fallback; otherwise derived from the name.
// primaryColor: kept for reference; not currently displayed.
export const COLLEGES = {
  'ut-austin': { name: 'The University of Texas at Austin', shortName: 'UT Austin', logo: '/colleges/ut-austin.svg', primaryColor: '#BF5700', monogram: 'UT' },
  'texas-am': { name: 'Texas A&M University', shortName: 'Texas A&M', logo: '/colleges/texas-am.svg', primaryColor: '#500000', monogram: 'TAMU' },
  'ut-dallas': { name: 'The University of Texas at Dallas', shortName: 'UT Dallas', logo: '/colleges/ut-dallas.svg', primaryColor: '#E87500', monogram: 'UTD' },
  'duke': { name: 'Duke University', shortName: 'Duke', logo: '/colleges/duke.svg', primaryColor: '#012169', monogram: 'DU' },
}

// yearsOnTeam set to 3 as a default for alumni whose tenure wasn't recorded — confirm with each person and correct.
export const ALUMNI = [
  // ---- Class of 2026 ----
  {
    id: 'ka', name: 'Kadhir Arunmozhiselvan', displayName: 'Kadhir A.', classYear: 2026,
    role: 'Captain & Build Lead', subteam: 'Building', yearsOnTeam: 3,
    college: 'ut-dallas', major: '', // CHECK: major not listed on profile
    summary: 'Served as Captain and Build Lead on Overdrive, and stayed on as a member and coach across three seasons. Outside robotics he was President of DECA and a karate instructor. He\'s now a freshman at UT Dallas.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },
  {
    id: 'pm', name: 'Pranav Mutthineni', displayName: 'Pranav M.', classYear: 2026,
    role: '', subteam: '', yearsOnTeam: 3, // CHECK: Overdrive role not listed on profile
    college: 'duke', major: 'Electrical & Computer Engineering',
    summary: 'Studying electrical and computer engineering at Duke. He interned at the UTD NanoTech Institute researching thermally driven polymer artificial muscles, and has worked as an engineer at Venus Tech since 2023.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },
  {
    id: 'snk', name: 'Subanth Nanda Kumar', displayName: 'Subanth N.', classYear: 2026,
    role: '', subteam: '', yearsOnTeam: 3, // CHECK: Overdrive role unknown
    college: 'ut-austin', major: 'Computer Science',
    summary: 'Studying computer science at UT Austin.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },

  // ---- Class of 2025 ----
  {
    id: 'am', name: 'Asvath Madhan', displayName: 'Asvath M.', classYear: 2025,
    role: 'Principal Programmer & Design Lead', subteam: 'Programming', yearsOnTeam: 3,
    college: 'texas-am', major: 'Computer Science',
    summary: 'Led Overdrive\'s design process and built the team\'s control system and codebase in Java with Roadrunner, then returned as a mentor. At Texas A&M he works on computer vision for RoboMasters and avionics for the Sounding Rocketry Team.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
    // NOTE: his role spanned Programming and CAD. Subteam set to Programming; confirm with him.
  },
  {
    id: 'sk', name: 'Srinanditha Kamath', displayName: 'Srinanditha K.', classYear: 2025,
    role: '', subteam: '', yearsOnTeam: 3, // CHECK: Overdrive role not listed on profile
    college: 'ut-austin', major: 'Computer Science & Mathematics',
    summary: 'Studying CS and math at UT Austin with a robotics minor. Through the Freshman Research Initiative she built a smart walker with real-time obstacle avoidance using OpenCV and time-of-flight sensors on a Jetson Nano, and she\'s a TA and a technical officer for Women in Computer Science.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },
  {
    id: 'ak', name: 'Adit Khandelwal', displayName: 'Adit K.', classYear: 2025,
    role: '', subteam: '', yearsOnTeam: 3, // CHECK: Overdrive role not listed on profile
    college: 'ut-austin', major: 'ECE Honors + Canfield Business Honors',
    summary: 'In the ECE and Canfield Business Honors programs at UT Austin. He researches at the CDUS Lab and works as a hardware engineer on Texas Aerial Robotics\' Raytheon team, using CAD and ROS.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },
  {
    id: 'arm', name: 'Aarush Malepatal', displayName: 'Aarush M.', classYear: 2025,
    role: '', subteam: '', yearsOnTeam: 3, // CHECK: Overdrive role not listed on profile
    college: 'ut-dallas', major: 'Finance',
    summary: 'Studying finance at UT Dallas with an interest in financial analysis and consulting. He managed organizational finances as a marketing manager with UNICEF and co-founded a web development project building sites for small businesses and school clubs.',
    advice: '', photo: '', hideCollege: false, confirmed: false,
  },
]
