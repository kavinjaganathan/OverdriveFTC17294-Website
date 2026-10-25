// Central site configuration.
export const TEAM = {
  name: 'OVERDRIVE',
  number: '17294',
  location: 'Frisco, Texas',
  est: 'Est. 2019',
  years: '7+ Years',
  motto: 'Think. Build. Inspire.',
  description:
    "Overdrive is FTC Team 17294, a robotics team based in Frisco, Texas. Since 2019, we've combined creativity, engineering, and programming to design and build robots for the FIRST Tech Challenge. Through collaboration, experimentation, and problem-solving, we turn ambitious ideas into working machines and inspire the next generation of innovators.",
  engineering:
    'From mechanical design and CAD to programming, fabrication, and testing, we approach every challenge as an opportunity to learn and improve. Our work combines technical creativity, collaboration, and persistence to turn ideas into practical solutions.',
}

// Source: pitch deck, Contact Info slide. YouTube/Instagram URLs are the standard
// profile URLs built from the handles in the deck — confirm they resolve before launch.
export const CONTACT = {
  email: 'ftcoverdrive17294@gmail.com',
  instagram: { handle: '@over_drive17294', url: 'https://www.instagram.com/over_drive17294/' },
  youtube: { handle: '@overdrverobotics7055', url: 'https://www.youtube.com/@overdrverobotics7055' },
}

// Navigation tabs. Only built pages are enabled; the rest render as disabled folder tabs.
export const TABS = [
  { id: 'home', label: 'Home', enabled: true },
  { id: 'team', label: 'Meet the Team', enabled: true },
  { id: 'robot', label: 'Robot' },
  { id: 'awards', label: 'Awards', enabled: true },
  { id: 'alumni', label: 'Alumni', enabled: true },
  // StemCycle Pickup (textbook donation pickups) lives at ftcoverdrive.org/STEM.
  { id: 'stemcycle', label: 'StemCycle', enabled: true, href: '/STEM' },
  { id: 'contact', label: 'Contact' },
]
