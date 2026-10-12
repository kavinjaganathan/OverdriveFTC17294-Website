// Awards timeline. Edit here; the Awards page renders straight from this file.
//
// Sources: the team's pitch deck (Awards and Achievements slide), checked against
// FIRST's official event records (ftc-events.firstinspires.org/team/17294 and each
// event's /awards page, last checked Oct 2026).
//
// Fields
//   season    FTC season, newest first
//   logo      official FIRST game logo for the season ({ src, w, h }, files in /public/seasons, taken from
//             FIRST's season logo packages). Omit it and the page shows the season years instead.
//   title     award as shown on the page; `detail` adds the official placing
//   events    one or more { name, place, date, iso, source }. `date` is shown as written;
//             `iso` is the first day (machine-readable). Leave both empty when only the
//             season is confirmed: the page then shows the season instead.
//   trophy    'oval' | 'tall' | 'uil': the trophy pictures the deck uses for each award (cut from the
//             deck into /public/awards; the UIL one is the championship trophy photo)
//   milestone true = highlighted entry (the state title)
//   tier      optional 'state' | 'alliance' | 'judged'; otherwise worked out from the title
//   verified  false = listed by the team but not found in FIRST's record; shown without a date
//   listedAs  how the deck words it, when the official record differs (kept for reference)

const EVENT = (path) => `https://ftc-events.firstinspires.org/${path}/awards`

export const TROPHIES = {
  oval: { src: '/awards/trophy-oval.png', w: 96, h: 153 },
  tall: { src: '/awards/trophy-tall.png', w: 63, h: 201 },
  uil: { src: '/uil-state-champions-trophy.png', w: 692, h: 473 },
}

export const AWARDS_INTRO =
  'Overdrive has competed in FIRST Tech Challenge since 2019. These are the awards the team has earned along the way, season by season, from its rookie year to now.'

export const SEASONS = [
  {
    season: '2025–2026', game: 'DECODE', logo: { src: '/seasons/2025-26-decode.png', w: 245, h: 360 },
    awards: [
      {
        id: 'sustain-2026', title: 'Sustain Award', count: 3, trophy: 'oval',
        events: [
          { name: 'FiT-North Last Call Qualifier', place: 'Flower Mound, TX', date: 'Feb 21, 2026', iso: '2026-02-21', source: EVENT('2025/USTXFMQ') },
          { name: 'FiT-North Dallas Semi-Regional', place: 'Dallas, TX', date: 'Feb 14, 2026', iso: '2026-02-14', source: EVENT('2025/USTXDASQ') },
          { name: 'FiT-North I&S League Tournament', place: 'Garland, TX', date: 'Jan 31, 2026', iso: '2026-01-31', source: EVENT('2025/USTXNISLT') },
        ],
      },
    ],
  },
  {
    season: '2024–2025', game: 'INTO THE DEEP', logo: { src: '/seasons/2024-25-into-the-deep.png', w: 325, h: 360 },
    awards: [
      {
        id: 'connect-2025', title: 'Connect Award', detail: '2nd place', trophy: 'oval',
        listedAs: 'Connect Award at A & G Semi-Area',
        events: [{ name: 'FiT-North Semi-Area Championship (Lago Lewisville)', place: 'Flower Mound, TX', date: 'Feb 8, 2025', iso: '2025-02-08', source: EVENT('2024/USTXFMQ') }],
      },
      {
        // The deck lists a Connect Award here; FIRST's record for this event shows Design Award 2nd Place
        // for 17294 (Connect went to 13472 and 23515), so the verified result is shown.
        id: 'design-2025', title: 'Design Award', detail: '2nd place', trophy: 'oval',
        listedAs: 'Connect Award at A & G League Tournament',
        events: [{ name: 'FiT-North A&G League Tournament', place: 'Grapevine, TX', date: 'Jan 25, 2025', iso: '2025-01-25', source: EVENT('2024/USTXNAGLT') }],
      },
    ],
  },
  {
    season: '2023–2024', game: 'CENTERSTAGE', logo: { src: '/seasons/2023-24-centerstage.png', w: 360, h: 154 },
    awards: [
      {
        id: 'uil-state-2024', title: 'State Champions', detail: 'Winning alliance, 2nd team selected', trophy: 'uil', milestone: true,
        events: [{ name: 'Texas FTC UIL 5A State Championship', place: 'Belton, TX', date: 'Mar 20–21, 2024', iso: '2024-03-20', source: EVENT('2023/USTXBES2') }],
      },
      {
        id: 'finalist-2024', title: 'Finalist Alliance', detail: '1st team selected', trophy: 'oval',
        events: [{ name: 'FiT-North Last Call Qualifier', place: 'Flower Mound, TX', date: 'Feb 17, 2024', iso: '2024-02-17', source: EVENT('2023/USTXFMQ') }],
      },
      {
        id: 'control-2024', title: 'Control Award', trophy: 'oval',
        events: [{ name: 'FiT-North Last Call Qualifier', place: 'Flower Mound, TX', date: 'Feb 17, 2024', iso: '2024-02-17', source: EVENT('2023/USTXFMQ') }],
      },
      {
        id: 'design-2023', title: 'Design Award', trophy: 'oval',
        events: [{ name: 'FiT-North C&N League Tournament', place: 'McKinney, TX', date: 'Dec 16, 2023', iso: '2023-12-16', source: EVENT('2023/USTXNCNLT') }],
      },
    ],
  },
  {
    season: '2022–2023', game: 'POWERPLAY', logo: { src: '/seasons/2022-23-powerplay.png', w: 232, h: 360 },
    awards: [
      {
        // Not on the deck's awards slide; added from FIRST's official record for this event.
        id: 'winning-2023', title: 'Winning Alliance', detail: '1st team selected', trophy: 'tall',
        events: [{ name: 'TX-North Last Call Qualifier', place: 'Flower Mound, TX', date: 'Feb 18, 2023', iso: '2023-02-18', source: EVENT('2022/USTXNOFMQ') }],
      },
    ],
  },
  {
    season: '2021–2022', game: 'FREIGHT FRENZY', logo: { src: '/seasons/2021-22-freight-frenzy.png', w: 330, h: 360 },
    awards: [
      {
        id: 'control-2022', title: 'Control Award', trophy: 'oval',
        listedAs: 'Control Award at Aledo Bearcat Qualifier',
        events: [{ name: 'TX-North Spring Qualifier #2a', place: 'Aledo, TX', date: 'Jan 20–22, 2022', iso: '2022-01-20', source: EVENT('2021/USTXNOALQ') }],
      },
      {
        id: 'winning-2022', title: 'Winning Alliance', detail: 'Captain', trophy: 'tall',
        listedAs: 'Winning Alliance at Aledo Bearcat Bot Brawl',
        events: [{ name: 'TX-North Spring Qualifier #2a', place: 'Aledo, TX', date: 'Jan 20–22, 2022', iso: '2022-01-20', source: EVENT('2021/USTXNOALQ') }],
      },
      {
        // Not in FIRST's 2021–2022 record (the team's only Control Award that season is the one above).
        // Possibly the 2020–2021 Aledo remote award listed twice. Confirm before keeping.
        id: 'control-2022-remote', title: 'Control Award', trophy: 'oval', verified: false,
        events: [{ name: 'Aledo Remote Qualifier', place: '', date: '', iso: '', source: '' }],
      },
    ],
  },
  {
    season: '2020–2021', game: 'ULTIMATE GOAL', logo: { src: '/seasons/2020-21-ultimate-goal.png', w: 320, h: 360 },
    awards: [
      {
        id: 'control-2021', title: 'Control Award', trophy: 'tall',
        events: [{ name: 'TX FTC North Aledo Qualifier #3 (remote)', place: 'Remote', date: 'Mar 6–13, 2021', iso: '2021-03-06', source: EVENT('2020/USTXNOQT3') }],
      },
      {
        id: 'ranked-2021', title: 'Second-Ranked Team', trophy: 'tall',
        events: [{ name: 'TX FTC North Aledo Qualifier #3 (remote)', place: 'Remote', date: 'Mar 6–13, 2021', iso: '2021-03-06', source: EVENT('2020/USTXNOQT3') }],
      },
    ],
  },
  {
    season: '2019–2020', game: 'SKYSTONE', logo: { src: '/seasons/2019-20-skystone.png', w: 360, h: 233 }, note: 'Rookie season',
    awards: [
      {
        id: 'innovate-2020', title: 'Innovate Award', detail: 'Sponsored by Collins Aerospace', trophy: 'tall',
        events: [{ name: 'Aledo Qualifier', place: 'Aledo, TX', date: 'Jan 18, 2020', iso: '2020-01-18', source: EVENT('2019/2019TXNQ7') }],
      },
      {
        id: 'winning-2020', title: 'Winning Alliance', detail: 'Captain', trophy: 'tall',
        listedAs: '2019-2021: Winning Alliance at Aledo Qualifiers',
        events: [{ name: 'Aledo Qualifier', place: 'Aledo, TX', date: 'Jan 18, 2020', iso: '2020-01-18', source: EVENT('2019/2019TXNQ7') }],
      },
    ],
  },
]
