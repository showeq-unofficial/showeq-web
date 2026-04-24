// Picks a random innocuous browser-tab title at app startup so a
// window-title scan from the running EQ client (or any process scanning
// open windows) doesn't see anything identifying. Called once from
// main.tsx before React mounts.
//
// To add new candidates, just append to the list — they should be plausible
// names for any generic web app and not contain anything tied to EQ /
// scanning / overlays.
const TITLES = [
  'Dashboard',
  'Notes',
  'Workspace',
  'Tracker',
  'Project Hub',
  'Tasks',
  'Console',
  'Editor',
  'Inbox',
  'Studio',
  'Monitor',
  'Logbook',
  'Atlas',
  'Pinboard',
  'Reports',
  'Notebook',
  'Planner',
  'Toolbox',
];

export function setRandomTitle(): void {
  const pick = TITLES[Math.floor(Math.random() * TITLES.length)];
  document.title = pick;
}
