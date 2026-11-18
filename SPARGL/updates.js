// ============================================================
// SPARGL: AUDIO LAB - UPDATE LOG
//
// To publish an update, add a new entry at the TOP of the list below.
//   v:       version label (shown as "v1.5")
//   date:    "YYYY-MM-DD"
//   changes: one string per bullet point
// The page shows entries in the order they are written (newest first).
// ============================================================
const UPDATE_LOG = [
  {
    v: "1.6",
    date: "2026-11-13",
    changes: [
      "New custom scrollbars",
      "Added new effects, Glitch, Auto-Tune (Work in Progress), Vocoder (Work in Progress), Harmonizer, Crush and Tape, and Texture",
      "Re-did the export tabs UI"
    ]
  },
  {
    v: "1.5",
    date: "2026-11-13",
    changes: [
      "Quick update changing track playthrough settings",
      "Effects no longer reset time on tracks"
    ]
  },
  {
    v: "1.4",
    date: "2026-11-12",
    changes: [
      "Update logs now written in updates.js instead of in the browser",
      "Rename tracks with the pencil button in library",
      "New Projects tab in the library: create projects and drag tracks in, between, and out of them",
      "Save preset button: name and keep your own effect settings under Custom Presets"
    ]
  },
  {
    v: "1.3",
    date: "2026-11-12",
    changes: [
      "Setting to switch to newly uploaded audio (off by default: uploads are added to the library and the current track stays loaded)",
      "Confirmation popup beside Reset FX",
      "Speed and pitch are now separate controls, with a lock toggle that links them like before",
      "Fixed the Slider step dropdown not showing the current selection",
      "Added the update log"
    ]
  },
  {
    v: "1.2",
    date: "2026.",
    changes: [
      "Settings menu, red / black / white theme, collapsible effect sections",
      "Typed values for every slider and a configurable slider step"
    ]
  },
  {
    v: "1.1",
    date: "2026.",
    changes: [
      "MP3 and WAV export with format, bitrate, channel and sample-rate dropdowns",
      "New effects: phaser, vibrato, gate, exciter, tube warmth, stereo width, limiter and edit tools",
      "About 100 presets in 9 categories with search"
    ]
  },
  {
    v: "1.0",
    date: "2026.",
    changes: [
      "First release: upload audio and keep it in your browser library",
      "Effects chain with presets and WAV export"
    ]
  }
];
