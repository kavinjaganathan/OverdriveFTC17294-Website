// Team roster. Edit here; the Meet the Team page renders straight from this file.
//
// Portraits: drop a file at public/team/<id>.jpg (4:5 works best). Until it exists the card
// shows a neutral initials placeholder. Do not use stand-in photos.
// `hobbies` is intentionally absent: add `hobbies: '...'` to a member once the team supplies it and
// the card will show it automatically.
// `draft: true` marks suggested wording the team should confirm or personalize.

/* ==========================================================================
   EDITABLE PAGE CONTENT: everything on the Meet the Team page that isn't a
   member record lives here. Skills, fun facts and stats are placeholders.
   ========================================================================== */
export const TEAM_PAGE = {
  intro: 'Behind every robot is a team of people bringing different skills and ideas together. Get to know the students who design, build, program, and share what we do at Overdrive.',

  // One line under the leadership cards. Empty string hides it.
  seasonGoal: '',

  // One sentence beside each subteam heading.
  subteams: {
    building: 'Turns finished designs into a working robot: assembly, fit, and mechanical fixes.',
    programming: 'Writes the autonomous routines, driver controls, and vision code that run the robot.',
    cad: 'Models every part and assembly before anything is cut or built.',
    outreach: 'Runs events, social media, sponsorships, and team finances.',
  },

  // 2–3 short tags per member, keyed by member id. Placeholders drawn from each description.
  skills: {
    'vrishank-e': ['Team management', 'Sponsorships'],
    'ishaan-t': ['Robot design', 'Workflow', 'Driving'],
    'ansika-j': ['Assembly', 'Mechanical fixes'],
    'yasho-c': ['Assembly', 'Testing'],
    'sid-c': ['Assembly', 'Troubleshooting'],
    'pranav-v': ['Autonomous', 'TeleOp', 'Driving'],
    'kavin-j': ['Computer vision', 'Path planning'],
    'ishaan-w': ['TeleOp', 'Sensors'],
    'adrit-c': ['Simulation', 'Mechanism design'],
    'vrushank-s': ['CAD modeling', 'Part design'],
    'shanyu-n': ['Assemblies', 'Layout'],
    'jayant-r': ['Partnerships', 'Nonprofit'],
    'ishan-k': ['Social media', 'Video'],
    'vibha-b': ['Events', 'Community'],
    'saurish-k': ['Finance', 'Documentation'],
  },

  // Optional one-liners, keyed by member id. Missing or empty = not shown.
  funFacts: {
    // 'kavin-j': 'Example: has rebuilt the same intake four times.',
  },

  // Closing strip. Replace the dashes with real numbers.
  stats: [
    { value: '15', label: 'Members' },
    { value: '7+', label: 'Years competing' },
    { value: '—', label: 'Awards' },
    { value: '—', label: 'Outreach hours' },
  ],

  cta: [
    { label: 'Join the team', href: '#contact', primary: true },
    { label: 'Sponsor us', href: '#contact' },
  ],
}

export const SCHOOL = 'Independence High School'

export const LEADERS = [
  {
    id: 'vrishank-e', name: 'Vrishank E.', title: 'Captain', grade: 'Senior', school: SCHOOL, year: '4th',
    specialty: 'Team leadership',
    description: 'Helps manage the team, build relationships with companies, and lead initiatives that create meaningful change.',
  },
  {
    id: 'ishaan-t', name: 'Ishaan T.', title: 'Vice Captain', grade: 'Junior', school: SCHOOL, year: '3rd',
    specialty: 'Team leadership',
    description: 'Contributes to robot design, coordinates technical workflows, and drives the robot during competition.',
  },
]

// Order here is the order on the page.
export const SUBTEAMS = [
  {
    id: 'building', title: 'Building',
    members: [
      {
        id: 'ansika-j', name: 'Ansika J.', title: 'Build Lead', grade: 'Senior', school: SCHOOL, year: '4th',
        description: 'Leads robot assembly and works with the engineering team to refine components, improve fit, and resolve mechanical issues.',
      },
      {
        id: 'yasho-c', name: 'Yasho C.', grade: 'Senior', school: SCHOOL, year: '4th', draft: true,
        description: 'Helps assemble robot mechanisms, install components, and check that the robot is structurally sound and ready for testing.',
      },
      {
        id: 'sid-c', name: 'Sid C.', grade: 'Junior', school: SCHOOL, year: '3rd', draft: true,
        description: 'Assists with mechanical assembly, tests moving components, and helps troubleshoot build issues during robot development.',
      },
    ],
  },
  {
    id: 'programming', title: 'Programming',
    members: [
      {
        id: 'pranav-v', name: 'Pranav V.', title: 'Programming Lead', grade: 'Junior', school: SCHOOL, year: '4th',
        description: 'Leads the programming team, coordinates autonomous and teleoperated software integration, contributes to robot driving during competition, and develops robot-control features.',
      },
      {
        id: 'kavin-j', name: 'Kavin J.', grade: 'Junior', school: SCHOOL, year: '2nd',
        description: 'Develops computer vision programs, object-detection systems, and autonomous navigation paths.',
      },
      {
        id: 'ishaan-w', name: 'Ishaan W.', grade: 'Sophomore', school: SCHOOL, year: '1st',
        description: 'Develops teleoperated controls and works with sensors, motors, and control systems to improve robot performance.',
      },
    ],
  },
  {
    id: 'cad', title: 'CAD',
    members: [
      {
        id: 'adrit-c', name: 'Adrit C.', title: 'Engineering Lead', grade: 'Sophomore', school: SCHOOL, year: '3rd',
        description: "Helps organize design sessions, run simulations, and plan the robot's individual components and mechanisms.",
      },
      {
        id: 'vrushank-s', name: 'Vrushank S.', grade: 'Freshman', school: SCHOOL, year: '1st', draft: true,
        description: 'Assists with CAD modeling, creating component designs, and refining part dimensions to help ensure components fit together.',
      },
      {
        id: 'shanyu-n', name: 'Shanyu N.', grade: 'Sophomore', school: SCHOOL, year: '2nd', draft: true,
        description: 'Assists with CAD assemblies, reviewing component placement, and refining robot layouts before parts are built.',
      },
    ],
  },
  {
    id: 'outreach', title: 'Outreach',
    members: [
      {
        id: 'jayant-r', name: 'Jayant R.', title: 'Outreach Lead', grade: 'Junior', school: SCHOOL, year: '3rd',
        description: "Leads outreach efforts, builds relationships with companies and community members, and helps guide the team's goal of establishing a nonprofit organization.",
      },
      {
        id: 'ishan-k', name: 'Ishan K.', grade: 'Junior', school: SCHOOL, year: '2nd',
        description: "Supports social media, edits videos, and helps maintain the team's online presence.",
      },
      {
        id: 'vibha-b', name: 'Vibha B.', grade: 'Junior', school: 'Centennial High School', year: '2nd',
        description: "Helps plan events, supports community initiatives, and develops awareness of the team's work and identity.",
      },
      {
        // Grade not confirmed: left out on purpose.
        id: 'saurish-k', name: 'Saurish K.', school: SCHOOL, year: '2nd',
        description: 'Helps manage team finances and donations, while coordinating with other subteams to document their progress.',
      },
    ],
  },
]
