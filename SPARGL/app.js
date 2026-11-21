// ============================================================
// SPARGL: AUDIO LAB
// Browser audio editor: effects chain, presets, library, export.
// ============================================================

// ---------- Helpers & effect definitions ----------
const $ = (s) => document.querySelector(s);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const KEYS = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
const SCALES = ["Chromatic", "Major", "Minor", "Major pentatonic", "Minor pentatonic"];
/**
 * Effect groups: [title, controls[]].
 * Each control: [key, label, min, max, default, step, "t"?]
 * A trailing "t" renders the control as a checkbox toggle instead of a slider.
 * A trailing "s" plus an options array renders a dropdown (the value is the option index).
 */
const G = [
  ["Basics", [
    ["gain", "Volume", 0, 2, 1, 0.01],
    ["pan", "Pan", -1, 1, 0, 0.01],
    ["speed", "Speed", 0.25, 3, 1, 0.01],
    ["pitch", "Pitch (semitones)", -24, 24, 0, 0.1],
    ["lock", "Lock speed & pitch", 0, 1, 1, 1, "t"],
    ["fi", "Fade in (export)", 0, 5, 0, 0.1],
    ["fo", "Fade out (export)", 0, 5, 0, 0.1]
  ]],
  ["Edit Tools", [
    ["ts", "Trim start %", 0, 100, 0, 0.1],
    ["te", "Trim end %", 0, 100, 100, 0.1],
    ["gate", "Noise gate dB", -80, -10, -80, 1],
    ["nrm", "Normalize", 0, 1, 0, 1, "t"],
    ["trim", "Trim silence", 0, 1, 0, 1, "t"],
    ["mono", "Mono", 0, 1, 0, 1, "t"],
    ["swap", "Swap L/R", 0, 1, 0, 1, "t"],
    ["inv", "Invert phase", 0, 1, 0, 1, "t"]
  ]],
  ["EQ & Tone", [
    ["lo", "Bass dB", -20, 20, 0, 0.5],
    ["mid", "Mid dB", -20, 20, 0, 0.5],
    ["mf", "Mid freq Hz", 200, 6000, 1000, 10],
    ["hi", "Treble dB", -20, 20, 0, 0.5],
    ["air", "Air (12k) dB", -12, 12, 0, 0.5],
    ["des", "De-ess (6.5k) dB", -12, 0, 0, 0.5]
  ]],
  ["Filters", [
    ["hp", "High-pass Hz", 20, 4000, 20, 1],
    ["lp", "Low-pass Hz", 200, 20000, 20000, 10],
    ["q", "Resonance", 0.1, 15, 0.7, 0.1]
  ]],
  ["Distortion / Saturation", [
    ["drv", "Drive", 0, 100, 0, 1],
    ["bits", "Bit depth", 1, 16, 16, 1],
    ["sat", "Tube warmth", 0, 1, 0, 0.01],
    ["exc", "Exciter", 0, 1, 0, 0.01]
  ]],
  ["Echo", [
    ["dt", "Time s", 0.02, 1, 0.3, 0.01],
    ["dfb", "Feedback", 0, 0.9, 0.4, 0.01],
    ["dmx", "Mix", 0, 1, 0, 0.01],
    ["dpp", "Ping-pong", 0, 1, 0, 1, "t"]
  ]],
  ["Reverb", [
    ["rsz", "Size s", 0.2, 6, 2, 0.1],
    ["rdc", "Decay", 0.5, 6, 2.5, 0.1],
    ["rmx", "Mix", 0, 1, 0, 0.01]
  ]],
  ["Chorus / Flanger", [
    ["chr", "Rate Hz", 0.1, 10, 1.5, 0.1],
    ["chd", "Depth", 0, 1, 0, 0.01],
    ["chb", "Base ms", 1, 30, 15, 0.5],
    ["chm", "Mix", 0, 1, 0.5, 0.01]
  ]],
  ["Phaser / Vibrato", [
    ["phr", "Phaser rate", 0.05, 8, 0.5, 0.05],
    ["phd", "Phaser depth", 0, 1, 0.7, 0.01],
    ["phm", "Phaser mix", 0, 1, 0, 0.01],
    ["vbr", "Vibrato rate", 0.5, 10, 5, 0.1],
    ["vbd", "Vibrato depth", 0, 1, 0, 0.01]
  ]],
  ["Tremolo / Gate / Wah", [
    ["trr", "Trem rate", 0.1, 20, 5, 0.1],
    ["trd", "Trem depth", 0, 1, 0, 0.01],
    ["gtr", "Gate rate Hz", 0.5, 16, 4, 0.1],
    ["gtd", "Gate depth", 0, 1, 0, 0.01],
    ["wr", "Wah rate", 0.1, 10, 1, 0.1],
    ["wd", "Wah depth", 0, 1, 0, 0.01]
  ]],
  ["Stereo", [
    ["wid", "Width (Haas)", 0, 1, 0, 0.01],
    ["apr", "Auto-pan rate", 0.1, 10, 1, 0.1],
    ["apd", "Auto-pan depth", 0, 1, 0, 0.01]
  ]],
  ["Ring Mod", [
    ["rgf", "Freq Hz", 20, 2000, 200, 1],
    ["rgm", "Mix", 0, 1, 0, 0.01]
  ]],
  ["Glitch / Stutter", [
    ["gla", "Amount", 0, 1, 0, 0.01],
    ["gls", "Slice ms", 30, 500, 120, 1],
    ["glt", "Max repeats", 2, 16, 4, 1],
    ["gsd", "Random seed", 1, 99, 1, 1]
  ]],
  ["Auto-Tune", [
    ["atm", "Strength", 0, 1, 0, 0.01],
    ["atk", "Key", 0, 11, 0, 1, "s", KEYS],
    ["ats", "Scale", 0, 4, 0, 1, "s", SCALES],
    ["atr", "Smoothness (0 = hard snap)", 0, 1, 0, 0.01]
  ]],
  ["Vocoder", [
    ["vcm", "Mix", 0, 1, 0, 0.01],
    ["vcb", "Bands", 0, 2, 1, 1, "s", ["8", "16", "24"]],
    ["vcn", "Note", 0, 11, 0, 1, "s", KEYS],
    ["vco", "Octave", 0, 3, 1, 1, "s", ["C2", "C3", "C4", "C5"]],
    ["vcc", "Chord", 0, 3, 2, 1, "s", ["Single", "Power (5th)", "Major", "Minor"]],
    ["vcz", "Breath / noise", 0, 1, 0.25, 0.01]
  ]],
  ["Harmonizer", [
    ["hmm", "Mix", 0, 1, 0, 0.01],
    ["hmi", "Interval (semitones)", -12, 12, 7, 1]
  ]],
  ["Lo-Fi Crush & Tape", [
    ["smp", "Sample-rate crush", 1, 64, 1, 1],
    ["tps", "Tape stop (s)", 0, 4, 0, 0.1],
    ["tpu", "Tape spin-up (s)", 0, 4, 0, 0.1]
  ]],
  ["Texture", [
    ["crk", "Vinyl crackle", 0, 1, 0, 0.01],
    ["his", "Tape hiss", 0, 1, 0, 0.01]
  ]],
  ["Dynamics", [
    ["th", "Comp threshold dB", -60, 0, 0, 1],
    ["ratio", "Ratio", 1, 20, 1, 0.5],
    ["mk", "Makeup dB", 0, 24, 0, 0.5],
    ["lim", "Limiter ceiling dB", -20, 0, 0, 0.5]
  ]]
];
const D = { rev: 0 };
G.forEach((g) => g[1].forEach((c) => D[c[0]] = c[4]));
/**
 * Presets, organised by category. Each preset only lists the parameters it
 * changes; every other parameter falls back to its default (see D below).
 */
const PC = {
  "Voice & Comms": {
    "Telephone": { hp: 400, lp: 3400, drv: 15, mid: 6, mf: 1500 },
    "AM Radio": { hp: 300, lp: 5000, drv: 25, th: -24, ratio: 6, mk: 6 },
    "Megaphone": { hp: 500, lp: 4000, drv: 45, mid: 8, mf: 2000, th: -20, ratio: 8, mk: 6 },
    "Walkie-Talkie": { hp: 600, lp: 3000, drv: 35, bits: 10, th: -20, ratio: 10, mk: 5 },
    "Intercom": { hp: 500, lp: 2800, drv: 20, bits: 12 },
    "Muffled": { lp: 700, hi: -6 },
    "Tinny": { hp: 1200, lp: 8000, hi: 4 },
    "Podcast": { hp: 80, lo: 3, mid: 3, mf: 2500, th: -22, ratio: 4, mk: 5 },
    "Vocal Clarity": { hp: 90, lo: -3, mid: 4, mf: 3000, hi: 3, th: -18, ratio: 3, mk: 3 },
    "De-Ess Vocal": { des: -8, hp: 80, th: -20, ratio: 3, mk: 2 },
    "Voice Gate Clean": { gate: -45, hp: 80 }
  },
  "Spaces & Reverb": {
    "Small Room": { rsz: 0.5, rdc: 3, rmx: 0.25 },
    "Bathroom": { rsz: 0.8, rdc: 2, rmx: 0.5, hi: 3 },
    "Hallway": { rsz: 1.5, rdc: 2.5, rmx: 0.4, dt: 0.15, dfb: 0.3, dmx: 0.2 },
    "Plate Verb": { rsz: 1.8, rdc: 1.8, rmx: 0.35, hi: 3 },
    "Concert Hall": { rsz: 3.5, rdc: 3, rmx: 0.4 },
    "Cathedral": { rsz: 5.5, rdc: 2.2, rmx: 0.65, hp: 120 },
    "Cave": { rsz: 3, rdc: 2, rmx: 0.5, dt: 0.35, dfb: 0.45, dmx: 0.25 },
    "Stadium": { rsz: 5, rdc: 1.5, rmx: 0.45, dt: 0.5, dfb: 0.35, dmx: 0.3 },
    "Underwater": { lp: 600, chd: 0.6, chr: 0.5, chm: 0.6, chb: 10, rmx: 0.3, rsz: 1.5 },
    "Reverse Verb": { rev: 1, rmx: 0.6, rsz: 3.5 }
  },
  "Creatures & Sci-Fi": {
    "Robot": { rgf: 100, rgm: 0.85 },
    "Dalek": { rgf: 30, rgm: 1, drv: 20, hp: 200 },
    "Cyborg": { rgf: 150, rgm: 0.6, chd: 0.5, chb: 4, chm: 0.5 },
    "Alien": { rgf: 400, rgm: 0.5, wd: 0.5, wr: 3, speed: 1.2, pitch: 3.16, lock: 1 },
    "Sci-Fi Comm": { hp: 500, lp: 3500, rgf: 600, rgm: 0.3, drv: 15 },
    "Ghost": { rmx: 0.6, rsz: 4, hp: 500, chd: 0.5, chr: 0.4, chm: 0.5, dt: 0.4, dfb: 0.5, dmx: 0.3, speed: 0.9, pitch: -1.82, lock: 1 },
    "Deep Monster": { speed: 0.65, pitch: -7.46, lock: 1, lo: 8, rmx: 0.3, rsz: 2, drv: 15 },
    "Demon": { speed: 0.6, pitch: -8.84, lock: 1, drv: 35, lo: 6, rgf: 60, rgm: 0.4, rmx: 0.3 },
    "Chipmunk": { speed: 1.7, pitch: 9.19, lock: 1 }
  },
  "Lo-Fi & Retro": {
    "Lo-Fi Tape": { speed: 0.97, pitch: -0.53, lock: 1, lp: 6000, hp: 80, bits: 10, trr: 0.8, trd: 0.2, drv: 8 },
    "Lo-Fi Chill": { lp: 4500, hp: 100, bits: 11, vbd: 0.2, vbr: 0.5, sat: 0.6, rmx: 0.2 },
    "Cassette Warble": { speed: 0.98, pitch: -0.35, lock: 1, vbd: 0.3, vbr: 0.7, lp: 7000, bits: 12, sat: 0.5 },
    "Old Vinyl": { hp: 200, lp: 5000, drv: 12, bits: 12, mid: 4 },
    "Vintage Warm": { sat: 0.7, lo: 3, hi: -3, lp: 12000 },
    "8-Bit": { bits: 4, lp: 8000, drv: 10 },
    "Game Boy": { bits: 3, lp: 6000, hp: 300, drv: 8 }
  },
  "Time & Echo": {
    "Slow-Mo": { speed: 0.5, pitch: -12, lock: 1 },
    "Half-Speed Doom": { speed: 0.5, pitch: -12, lock: 1, lo: 6, rmx: 0.3 },
    "Double Time": { speed: 1.5, pitch: 7.02, lock: 1 },
    "Fast Forward": { speed: 2, pitch: 12, lock: 1 },
    "Slapback": { dt: 0.12, dfb: 0.15, dmx: 0.5 },
    "Tape Echo": { dt: 0.28, dfb: 0.45, dmx: 0.4, lp: 4500, hp: 200, sat: 0.4 },
    "Echo Canyon": { dt: 0.55, dfb: 0.6, dmx: 0.6, rmx: 0.3, rsz: 3 },
    "Space Dub": { dt: 0.375, dfb: 0.7, dmx: 0.6, rmx: 0.4, rsz: 4, lp: 5000 }
  },
  "Modulation & Movement": {
    "Flanger Jet": { chb: 2, chd: 0.9, chr: 0.3, chm: 0.7 },
    "Chorus Wide": { chd: 0.5, chr: 0.8, chm: 0.5, chb: 18, wid: 0.5 },
    "Phaser Sweep": { phm: 0.6, phr: 0.4, phd: 0.8 },
    "Auto-Pan": { apd: 0.9, apr: 1.5 },
    "Vibrato": { vbd: 0.6, vbr: 5.5 },
    "Leslie Speaker": { trd: 0.5, trr: 6, vbd: 0.3, vbr: 6, apd: 0.5, apr: 6 },
    "Wobble": { trr: 6, trd: 0.8 },
    "Wah-Wah": { wd: 0.8, wr: 2 },
    "Trance Gate": { gtd: 1, gtr: 8 },
    "EDM Pump": { gtd: 0.7, gtr: 2, lim: -3 },
    "Stutter": { gtd: 1, gtr: 14 }
  },
  "Creative & Glitch": {
    "Glitch Hop": { gla: 0.5, gls: 140, glt: 6, gsd: 3 },
    "Stutter Edit": { gla: 0.8, gls: 90, glt: 8, gsd: 7 },
    "Broken Tape": { gla: 0.35, gls: 200, glt: 4, gsd: 11, tps: 1.5, crk: 0.4, his: 0.15, lp: 6000 },
    "T-Pain Auto-Tune": { atm: 1, atr: 0, atk: 0, ats: 0 },
    "Gentle Tune (C Major)": { atm: 0.7, atr: 0.3, atk: 0, ats: 1 },
    "Pentatonic Tune": { atm: 1, atr: 0.15, atk: 0, ats: 3 },
    "Vocoder Classic": { vcm: 1, vcb: 1, vcc: 0, vcn: 0, vco: 1, vcz: 0.2 },
    "Robot Choir": { vcm: 1, vcb: 1, vcc: 2, vco: 1, vcz: 0.15, rmx: 0.25, rsz: 2 },
    "Whisper Vocoder": { vcm: 1, vcb: 2, vcc: 0, vco: 2, vcz: 1 },
    "Dark Vocoder": { vcm: 1, vcb: 1, vcc: 3, vcn: 9, vco: 0, vcz: 0.2, drv: 15 },
    "Glitch Vocoder": { vcm: 0.7, vcc: 2, gla: 0.4, gls: 110, glt: 5, gsd: 5 },
    "Octave Up Double": { hmm: 0.5, hmi: 12 },
    "Octave Down Double": { hmm: 0.6, hmi: -12 },
    "Fifth Harmony": { hmm: 0.5, hmi: 7 },
    "Shimmer Verb": { hmm: 0.6, hmi: 12, rmx: 0.55, rsz: 4, rdc: 2 },
    "Tape Stop Outro": { tps: 2 },
    "Tape Spin-Up": { tpu: 1.5 },
    "Crushed Rate": { smp: 14, bits: 8, drv: 10 },
    "Vinyl Crackle": { crk: 0.6, his: 0.2, lp: 7000, hp: 120 },
    "Ping-Pong Echo": { dpp: 1, dt: 0.33, dfb: 0.5, dmx: 0.5 }
  },
  "Music Mixing": {
    "Vocal Polish": { hp: 90, lo: -2, mid: 3, mf: 3500, air: 4, des: -4, th: -20, ratio: 3, mk: 3, sat: 0.2, rmx: 0.12, rsz: 1.2 },
    "Vocal Air": { air: 8, hi: 2, hp: 100 },
    "Warm Vocal": { lo: 3, hi: -2, sat: 0.4, th: -18, ratio: 2.5, mk: 2 },
    "Vocal Doubler": { chd: 0.3, chb: 22, chm: 0.4, chr: 0.6, wid: 0.4 },
    "Kick Boost": { lo: 10, mid: -3, mf: 400, th: -18, ratio: 4, mk: 3 },
    "Snare Crack": { mid: 6, mf: 3500, hi: 3, th: -20, ratio: 4, mk: 2, rsz: 0.6, rmx: 0.15 },
    "Drum Bus Punch": { lo: 3, hi: 3, th: -24, ratio: 5, mk: 5, sat: 0.3 },
    "Bass Tight": { lp: 5000, hp: 35, lo: 3, th: -20, ratio: 4, mk: 3, sat: 0.25 },
    "Guitar Crunch": { drv: 40, mid: 4, mf: 1200, lp: 7000, hp: 90, rmx: 0.1 },
    "Acoustic Sparkle": { air: 6, hi: 2, hp: 70, exc: 0.25 },
    "Piano Room": { rsz: 1.4, rdc: 2.5, rmx: 0.2, hi: 1, lo: 1 },
    "Synth Pad Wide": { wid: 0.7, chd: 0.5, chm: 0.5, chr: 0.4, rmx: 0.45, rsz: 3.5 },
    "Exciter Shine": { exc: 0.5, air: 3 }
  },
  "Distortion & Grit": {
    "Overdrive": { drv: 35, mid: 3, mf: 1500 },
    "Heavy Distortion": { drv: 80, lp: 6000, th: -15, ratio: 6 },
    "Fuzz": { drv: 100, mid: 5, mf: 800, lp: 4000 },
    "Tube Saturation": { sat: 0.8 },
    "Bit Destroyer": { bits: 2, drv: 30 }
  },
  "Mastering & Utility": {
    "Mastering Glue": { th: -18, ratio: 2, mk: 3, wid: 0.2, lim: -1, lo: 1, hi: 1 },
    "Loudness Max": { th: -24, ratio: 6, mk: 8, lim: -2, nrm: 1 },
    "Squash": { th: -35, ratio: 20, mk: 12 },
    "Wide Master": { wid: 0.5 },
    "Bass Boost": { lo: 12, hi: -2 },
    "Treble Boost": { hi: 10, hp: 100 },
    "Rumble Cleanup": { hp: 80 },
    "Gate Cleanup": { gate: -50, hp: 60 },
    "Normalize Only": { nrm: 1 },
    "Trim Silence": { trim: 1, nrm: 1 },
    "Mono Compat": { mono: 1 },
    "Phase Flip": { inv: 1 },
    "Swap Channels": { swap: 1 }
  }
};
const PF = Object.assign({}, ...Object.values(PC));
// ---------- Settings & app state ----------
const SD = { theme: "auto", step: 0.5, auto: true, save: true, sw: false, paste: "after" };
let S = { ...SD };
try {
  S = { ...SD, ...JSON.parse(localStorage.getItem("spargl-set") || "{}") };
} catch (e) {
}
const saveS = () => {
  try {
    localStorage.setItem("spargl-set", JSON.stringify(S));
  } catch (e) {
  }
};
function applyTheme() {
  if (S.theme == "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = S.theme;
}
let p = { ...D };
let buf = null;
let cache = null;
let actx = null;
let src = null;
let oscs = [];
let playing = false;
let loop = false;
let byp = false;
let pos = 0;
let startT = 0;
let name = "";
let cp = "";
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.className = "s";
  clearTimeout(toast.i);
  toast.i = setTimeout(() => t.className = "", 2600);
};
const PK = ["rev", "ts", "te", "trim", "nrm", "mono", "swap", "inv", "gate", "smp", "gla", "gls", "glt", "gsd", "tps", "tpu", "crk", "his", "atm", "atk", "ats", "atr", "hmi", "hmm"];
const pk = () => PK.map((k) => p[k]).join() + "," + effK().toFixed(3) + (byp ? "b" : "");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pitchRatio = (q) => Math.pow(2, q.pitch / 12);
// Playback rate of the audio source. Locked: speed drives both speed and pitch
// (tape-style). Unlocked: the rate only carries the pitch change.
const prate = (q) => q.lock ? q.speed : pitchRatio(q);
// Time-stretch factor (new length / old length) that makes speed independent of pitch.
const kOf = (q) => q.lock ? 1 : clamp(pitchRatio(q) / q.speed, 0.25, 4);
const effK = () => byp ? 1 : kOf(p);
const R = () => byp ? 1 : prate(p);
// ---------- Time stretch (WSOLA): change length without changing pitch ----------
let stCache = null;
function stretchBuf(b, k) {
  if (Math.abs(k - 1) < 0.001) return b;
  if (stCache && stCache.b === b && stCache.k === k) return stCache.o;
  const sr = b.sampleRate;
  const nc = b.numberOfChannels;
  const len = b.length;
  const N = Math.round(sr * 0.04) & ~1; // grain size (~40 ms)
  const Hs = N / 2; // synthesis hop
  const Ha = Hs / k; // analysis hop
  const tol = Math.round(sr * 0.006); // search range for best grain alignment
  const outLen = Math.ceil(len * k);
  const X = [...Array(nc)].map((_, c) => b.getChannelData(c));
  const Y = X.map(() => new Float32Array(outLen + N));
  const W = new Float32Array(outLen + N);
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
  const x0 = X[0];
  const at = (i) => i >= 0 && i < len ? x0[i] : 0;
  let prev = 0;
  for (let m = 0; m * Hs < outLen; m++) {
    let pos = Math.round(m * Ha);
    if (m > 0) {
      const ref = prev + Hs;
      let best = pos;
      let bestScore = -Infinity;
      for (let c = Math.max(0, pos - tol); c <= pos + tol; c += 2) {
        let dot = 0;
        let en = 1e-9;
        for (let i = 0; i < N; i += 8) {
          const v = at(c + i);
          dot += at(ref + i) * v;
          en += v * v;
        }
        const score = dot / Math.sqrt(en);
        if (score > bestScore) {
          bestScore = score;
          best = c;
        }
      }
      pos = best;
    }
    prev = pos;
    const o = m * Hs;
    for (let c = 0; c < nc; c++) {
      const x = X[c];
      const y = Y[c];
      for (let i = 0; i < N; i++) {
        const j = pos + i;
        if (j >= 0 && j < len) y[o + i] += win[i] * x[j];
      }
    }
    for (let i = 0; i < N; i++) W[o + i] += win[i];
  }
  const out = new AudioBuffer({ length: outLen, numberOfChannels: nc, sampleRate: sr });
  Y.forEach((y, c) => {
    for (let i = 0; i < outLen; i++) y[i] = W[i] > 1e-3 ? y[i] / W[i] : 0;
    out.copyToChannel(y.subarray(0, outLen), c);
  });
  stCache = { b, k, o: out };
  return out;
}
// ---------- Creative effects (buffer level) ----------
// Small seeded random generator so glitches and crackle sound the same on every render.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
// Glitch / stutter: each slice is kept, or randomly stuttered, reversed, dropped or replaced by the previous slice.
function glitchFx(A, sr, amt, ms, rep, seed) {
  const n = A[0].length;
  const L = Math.max(64, Math.round(sr * ms / 1000));
  const rnd = mulberry32(seed * 7919 + 13);
  const out = A.map(() => new Float32Array(n));
  let prev = 0;
  for (let s = 0; s < n; s += L) {
    const len = Math.min(L, n - s);
    const act = rnd() < amt ? 1 + Math.floor(rnd() * 4) : 0;
    const k = 2 + Math.floor(rnd() * Math.max(1, rep - 1));
    const piece = Math.max(32, Math.floor(len / k));
    A.forEach((x, c) => {
      const y = out[c];
      for (let i = 0; i < len; i++) {
        if (act == 0) y[s + i] = x[s + i]; // untouched
        else if (act == 1) y[s + i] = x[s + i % piece]; // stutter: repeat the slice start
        else if (act == 2) y[s + i] = x[s + len - 1 - i]; // reverse the slice
        else if (act == 4) y[s + i] = x[Math.min(n - 1, prev + i % L)]; // repeat the previous slice
      } // act 3: silence (drop-out)
    });
    prev = s;
  }
  return out;
}
// Sample-rate crush: hold every Nth sample.
function crushFx(A, f) {
  f = Math.max(1, Math.round(f));
  A.forEach((x) => {
    for (let i = 0; i < x.length; i++) if (i % f) x[i] = x[i - i % f];
  });
}
// Tape stop: the last `secs` slow down to a halt.
function tapeStopFx(A, sr, secs) {
  const n = A[0].length;
  const T = Math.min(n, Math.round(secs * sr));
  if (T < 2) return;
  const st = n - T;
  A.forEach((x) => {
    const src = x.slice(st);
    for (let j = 0; j < T; j++) {
      const pos = j - j * j / (2 * T);
      const i0 = Math.floor(pos);
      const fr = pos - i0;
      x[st + j] = src[i0] * (1 - fr) + src[Math.min(T - 1, i0 + 1)] * fr;
    }
  });
}
// Tape spin-up: the start speeds up from a standstill (the rest of the audio is delayed to match).
function spinUpFx(A, sr, secs) {
  const n = A[0].length;
  const T = Math.min(Math.floor(n / 2), Math.round(secs * sr));
  if (T < 2) return;
  A.forEach((x) => {
    const src = x.slice();
    for (let j = 0; j < n; j++) {
      const pos = j < T ? j * j / (2 * T) : j - T / 2;
      const i0 = Math.floor(pos);
      const fr = pos - i0;
      x[j] = i0 + 1 < n ? src[i0] * (1 - fr) + src[i0 + 1] * fr : 0;
    }
  });
}
// Vinyl crackle (random pops) and tape hiss.
function textureFx(A, crk, his) {
  const rnd = mulberry32(4242);
  const n = A[0].length;
  const pop = new Float32Array(n);
  let e = 0;
  for (let i = 0; i < n; i++) {
    e *= 0.92;
    if (rnd() < crk * 0.0012) e += (rnd() * 2 - 1) * (0.15 + rnd() * 0.5) * crk;
    pop[i] = e;
  }
  A.forEach((x) => {
    for (let i = 0; i < n; i++) x[i] += pop[i] + (rnd() * 2 - 1) * his * 0.04;
  });
}
// ---------- Pitch detection, auto-tune and harmonizer ----------
const SCALE_NOTES = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10], [0, 2, 4, 7, 9], [0, 3, 5, 7, 10]];
// Autocorrelation pitch tracker. Returns the frequency (Hz, 0 = unvoiced) for every `hop` samples.
function detectPitch(x, sr) {
  const dec = 2;
  const fs = sr / dec;
  const m = Math.floor(x.length / dec);
  const d = new Float32Array(m);
  for (let i = 0; i < m; i++) d[i] = (x[i * dec] + x[i * dec + 1]) * 0.5;
  const sq = new Float64Array(m + 1);
  for (let i = 0; i < m; i++) sq[i + 1] = sq[i] + d[i] * d[i];
  const W = 640;
  const hop = 512;
  const minLag = Math.floor(fs / 800);
  const maxLag = Math.floor(fs / 70);
  const nf = Math.max(0, Math.floor((m - W - maxLag - 2) / hop) + 1);
  const f0 = new Float32Array(nf);
  const r = new Float32Array(maxLag + 2);
  for (let f = 0; f < nf; f++) {
    const s = f * hop;
    const e0 = sq[s + W] - sq[s];
    if (e0 < 0.0001 * W) continue;
    let best = 0;
    let bestLag = minLag;
    for (let l = minLag; l <= maxLag; l++) {
      let dot = 0;
      for (let i = 0; i < W; i += 2) dot += d[s + i] * d[s + i + l];
      const el = sq[s + l + W] - sq[s + l];
      r[l] = 2 * dot / Math.sqrt(e0 * el + 1e-9);
      if (r[l] > best) {
        best = r[l];
        bestLag = l;
      }
    }
    if (best < 0.55) continue;
    let lag = bestLag;
    for (let l = minLag + 1; l < maxLag; l++) {
      if (r[l] >= 0.9 * best && r[l] >= r[l - 1] && r[l] >= r[l + 1]) {
        lag = l; // prefer the shortest strong period to avoid octave errors
        break;
      }
    }
    const a = r[lag - 1];
    const b = r[lag];
    const c = r[lag + 1];
    const den = a - 2 * b + c;
    f0[f] = fs / (lag + (den ? 0.5 * (a - c) / den : 0));
  }
  return { hop: hop * dec, f0 };
}
// Semitone correction for each frame: nearest note in the chosen key/scale, scaled by strength and smoothed.
function tuneOffsets(f0, key, scale, strength, smooth) {
  const out = new Float32Array(f0.length);
  const alpha = 1 - 0.95 * smooth;
  const mask = SCALE_NOTES[scale];
  let cur = 0;
  for (let f = 0; f < f0.length; f++) {
    let target = 0;
    if (f0[f] > 0) {
      const midi = 69 + 12 * Math.log2(f0[f] / 440);
      let best = Math.round(midi);
      let bd = 99;
      for (let n = Math.round(midi) - 6; n <= Math.round(midi) + 6; n++) {
        if (!mask.includes(((n - key) % 12 + 12) % 12)) continue;
        const dd = Math.abs(n - midi);
        if (dd < bd) {
          bd = dd;
          best = n;
        }
      }
      target = (best - midi) * strength;
    }
    cur += (target - cur) * alpha;
    out[f] = cur;
  }
  return out;
}
// Pitch-synchronous overlap-add (PSOLA): shifts pitch and keeps the duration.
// Two-period grains are cut at spacing = the detected pitch period, then laid back
// down at period / ratio, repeating or skipping grains so timing stays put.
// semiAt(sample, voiced) gives the shift in semitones at that point.
function psola(X, sr, f0, hop, semiAt) {
  const len = X[0].length;
  const nc = X.length;
  const frame = (t) => clamp(Math.floor((t - 640) / hop), 0, f0.length - 1);
  const pitchAt = (t) => f0.length ? f0[frame(t)] : 0;
  const mt = []; // analysis marks (sample positions)
  const mT = []; // local period at each mark
  for (let t = 0; t < len + 2000;) {
    const f = pitchAt(t);
    const T = f > 0 ? sr / f : sr * 0.008;
    mt.push(t);
    mT.push(T);
    t += T;
  }
  const Y = X.map(() => new Float32Array(len));
  const W = new Float32Array(len);
  let k = 0;
  for (let s = 0; s < len;) {
    while (k + 1 < mt.length && Math.abs(mt[k + 1] - s) < Math.abs(mt[k] - s)) k++;
    const T = mT[k];
    const a = Math.round(mt[k]);
    const ratio = Math.pow(2, semiAt(s, pitchAt(a) > 0) / 12);
    const half = Math.max(2, Math.round(T));
    const c0 = Math.round(s);
    for (let i = -half; i < half; i++) {
      const o = c0 + i;
      if (o < 0 || o >= len) continue;
      const w = 0.5 + 0.5 * Math.cos(Math.PI * i / half);
      W[o] += w;
      const src = a + i;
      if (src >= 0 && src < len) for (let c = 0; c < nc; c++) Y[c][o] += w * X[c][src];
    }
    s += T / ratio;
  }
  for (const y of Y) for (let i = 0; i < len; i++) y[i] = W[i] > 0.001 ? y[i] / W[i] : 0;
  return Y;
}
const monoOf = (X) => {
  const m = new Float32Array(X[0].length);
  X.forEach((x) => {
    for (let i = 0; i < x.length; i++) m[i] += x[i] / X.length;
  });
  return m;
};
// Auto-tune + harmonizer on the whole buffer (slow, so the result is cached).
let ctCache = null;
function creativeStage(b, p) {
  if (!(p.atm > 0 || p.hmm > 0)) return b;
  const key = [p.atm, p.atk, p.ats, p.atr, p.hmi, p.hmm].join();
  if (ctCache && ctCache.b === b && ctCache.key === key) return ctCache.o;
  const sr = b.sampleRate;
  const nc = b.numberOfChannels;
  let Y = [...Array(nc)].map((_, c) => b.getChannelData(c));
  if (p.atm > 0) {
    const { hop, f0 } = detectPitch(monoOf(Y), sr);
    const off = tuneOffsets(f0, p.atk, p.ats, p.atm, p.atr);
    Y = psola(Y, sr, f0, hop, (t, voiced) => voiced && off.length ? off[clamp(Math.floor((t - 640) / hop), 0, off.length - 1)] : 0);
  }
  if (p.hmm > 0) {
    const { hop, f0 } = detectPitch(monoOf(Y), sr);
    const H = psola(Y, sr, f0, hop, () => p.hmi);
    Y = Y.map((y, c) => y.map((v, i) => v + H[c][i] * p.hmm));
  }
  const o = new AudioBuffer({ length: b.length, numberOfChannels: nc, sampleRate: sr });
  Y.forEach((y, c) => o.copyToChannel(y, c));
  ctCache = { b, key, o };
  return o;
}
// ---------- Edit tools (applied to the audio buffer) ----------
let prepInfo = null; // how the last prepped buffer maps back to the source (used by region editing)
function prep(b, p) {
  b = stretchBuf(b, byp ? 1 : kOf(p));
  if (!byp) b = creativeStage(b, p);
  const nc = b.numberOfChannels;
  let s = Math.floor(b.length * p.ts / 100);
  let e = Math.floor(b.length * p.te / 100);
  if (e - s < 64) {
    e = Math.min(b.length, s + 64);
    s = Math.max(0, e - 64);
  }
  let A = [...Array(nc)].map((_, c) => b.getChannelData(c).slice(s, e));
  let trimOff = 0;
  if (p.trim) {
    let a = 0;
    let z = A[0].length - 1;
    const hit = (i) => A.some((x) => Math.abs(x[i]) > 0.01);
    while (a < z && !hit(a)) a++;
    while (z > a && !hit(z)) z--;
    trimOff = a;
    A = A.map((x) => x.slice(a, z + 1));
  }
  if (p.mono && nc > 1) {
    const m = new Float32Array(A[0].length);
    A.forEach((x) => x.forEach((v, i) => m[i] += v / nc));
    A = A.map(() => m.slice());
  }
  if (p.swap && nc > 1) A = [A[1], A[0], ...A.slice(2)];
  if (p.inv) A.forEach((x) => {
    for (let i = 0; i < x.length; i++) x[i] = -x[i];
  });
  if (!byp && p.smp > 1) crushFx(A, p.smp);
  if (!byp && p.gla > 0) A = glitchFx(A, b.sampleRate, p.gla, p.gls, p.glt, p.gsd);
  if (p.gate > -80) {
    const th = Math.pow(10, p.gate / 20);
    const n = A[0].length;
    let env = 0;
    let g = 0;
    for (let i = 0; i < n; i++) {
      let m = 0;
      for (const x of A) m = Math.max(m, Math.abs(x[i]));
      env = Math.max(m, env * 0.9995);
      g += ((env > th ? 1 : 0) - g) * 0.002;
      for (const x of A) x[i] *= g;
    }
  }
  if (p.rev) A.forEach((x) => x.reverse());
  if (!byp) {
    if (p.tps > 0) tapeStopFx(A, b.sampleRate, p.tps);
    if (p.tpu > 0) spinUpFx(A, b.sampleRate, p.tpu);
    if (p.crk > 0 || p.his > 0) textureFx(A, p.crk, p.his);
  }
  if (p.nrm) {
    let m = 0;
    A.forEach((x) => {
      for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i]));
    });
    if (m > 0) A.forEach((x) => {
      const k = 0.89 / m;
      for (let i = 0; i < x.length; i++) x[i] *= k;
    });
  }
  const o = new AudioBuffer({ length: A[0].length, numberOfChannels: nc, sampleRate: b.sampleRate });
  A.forEach((x, c) => o.copyToChannel(x, c));
  prepInfo = { s, a: trimOff, rev: !!p.rev, k: byp ? 1 : kOf(p), sr: b.sampleRate, n: A[0].length };
  return o;
}
function cur() {
  const k = pk();
  if (!cache || cache.k != k || cache.b !== buf) cache = { k, b: buf, o: prep(buf, p), info: prepInfo };
  return cache.o;
}
// ---------- Effects chain (Web Audio) ----------
function ir(c, sz, dc) {
  const n = Math.floor(c.sampleRate * sz);
  const b = c.createBuffer(2, n, c.sampleRate);
  for (let h = 0; h < 2; h++) {
    const d = b.getChannelData(h);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, dc);
  }
  return b;
}
const curve = (f) => {
  const c = new Float32Array(2048);
  for (let i = 0; i < 2048; i++) c[i] = f(i / 1023.5 - 1);
  return c;
};
const VOC_GAIN = 10; // envelope makeup gain
const ABS_CURVE = curve((x) => Math.abs(x)); // full-wave rectifier for the vocoder
function mk(c, p, inp, L) {
  let n = inp;
  const add = (x) => {
    n.connect(x);
    n = x;
    return x;
  };
  const G_ = (v) => {
    const g = c.createGain();
    g.gain.value = v;
    return g;
  };
  const ws = (f) => {
    const w = c.createWaveShaper();
    w.curve = curve(f);
    w.oversample = "4x";
    return w;
  };
  const bq = (t, f, g, q) => {
    const b = c.createBiquadFilter();
    b.type = t;
    b.frequency.value = f;
    if (g != null) b.gain.value = g;
    if (q != null) b.Q.value = q;
    return b;
  };
  const lfo = (f, amt, target, ty) => {
    const o = c.createOscillator();
    const g = G_(amt);
    o.type = ty || "sine";
    o.frequency.value = f;
    o.connect(g);
    g.connect(target);
    o.start();
    L.push(o);
    return g;
  };
  const par = (mix, xf, fn) => {
    if (mix < 0.001) return;
    const i = n;
    const s = G_(1);
    const d = G_(xf ? 1 - mix : 1);
    const w = G_(mix);
    i.connect(d);
    d.connect(s);
    fn(i, w);
    w.connect(s);
    n = s;
  };
  add(bq("lowshelf", 120, p.lo));
  add(bq("peaking", p.mf, p.mid, 1));
  add(bq("highshelf", 5000, p.hi));
  add(bq("highshelf", 12000, p.air));
  if (p.des < 0) add(bq("peaking", 6500, p.des, 2));
  if (p.hp > 20) add(bq("highpass", p.hp, null, p.q));
  if (p.lp < 19900) add(bq("lowpass", p.lp, null, p.q));
  par(p.sat, 1, (i, o) => {
    const w = ws((x) => (Math.tanh(2.5 * x + 0.4) - Math.tanh(0.4)) / 1.1);
    i.connect(w);
    w.connect(o);
  });
  par(p.exc, 0, (i, o) => {
    const h = bq("highpass", 3500);
    const w = ws((x) => Math.tanh(x * 6) * 0.5);
    i.connect(h);
    h.connect(w);
    w.connect(o);
  });
  if (p.drv > 0) {
    const k = 1 + p.drv / 5;
    add(ws((x) => Math.tanh(x * k) / Math.tanh(k * 0.6) * 0.7));
  }
  if (p.bits < 16) {
    const l = Math.pow(2, p.bits) / 2;
    add(ws((x) => Math.round(x * l) / l));
  }
  if (p.wd > 0) {
    const f = add(bq("bandpass", 1200, null, 4));
    lfo(p.wr, p.wd * 1000, f.frequency);
    add(G_(2));
  }
  par(p.phm, 0, (i, o) => {
    const os = c.createOscillator();
    const lg = G_(p.phd * 700);
    os.frequency.value = p.phr;
    os.connect(lg);
    os.start();
    L.push(os);
    let t = i;
    for (let k = 0; k < 4; k++) {
      const a = bq("allpass", 900, null, 0.8);
      lg.connect(a.frequency);
      t.connect(a);
      t = a;
    }
    t.connect(o);
  });
  if (p.vbd > 0) {
    const d = add(c.createDelay(0.05));
    d.delayTime.value = 0.01;
    lfo(p.vbr, p.vbd * 0.008, d.delayTime);
  }
  if (p.trd > 0) {
    const g = add(G_(1 - p.trd / 2));
    lfo(p.trr, p.trd / 2, g.gain);
  }
  if (p.gtd > 0) {
    const g = add(G_(1 - p.gtd / 2));
    lfo(p.gtr, p.gtd / 2, g.gain, "square");
  }
  par(p.rgm, 1, (i, o) => {
    const r = G_(0);
    const os = c.createOscillator();
    os.frequency.value = p.rgf;
    os.connect(r.gain);
    os.start();
    L.push(os);
    i.connect(r);
    r.connect(o);
  });
  par(p.vcm, 1, (i, o) => {
    // Vocoder: the audio shapes a synth (saw chord + noise) through matching band-pass filters.
    const nb = [8, 16, 24][p.vcb];
    const base = 65.41 * Math.pow(2, p.vco) * Math.pow(2, p.vcn / 12);
    const carrier = G_(0.3);
    [[1], [1, 1.5], [1, 1.25, 1.5], [1, 1.2, 1.5]][p.vcc].forEach((r) => {
      const os = c.createOscillator();
      os.type = "sawtooth";
      os.frequency.value = base * r;
      os.start();
      L.push(os);
      os.connect(carrier);
    });
    if (p.vcz > 0) {
      const nbuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const nd = nbuf.getChannelData(0);
      for (let k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
      const ns = c.createBufferSource();
      ns.buffer = nbuf;
      ns.loop = true;
      ns.start();
      L.push(ns);
      const ng = G_(p.vcz * 0.5);
      ns.connect(ng);
      ng.connect(carrier);
    }
    const bw = Math.log2(80) / nb;
    const q = 1 / (2 * Math.sinh(Math.LN2 / 2 * bw));
    for (let k = 0; k < nb; k++) {
      const f = 100 * Math.pow(80, k / (nb - 1));
      const m = bq("bandpass", f, null, q);
      const rect = c.createWaveShaper();
      rect.curve = ABS_CURVE;
      const env = bq("lowpass", 40, null, 0.7);
      const amp = G_(VOC_GAIN);
      const cf = bq("bandpass", f, null, q);
      const band = G_(0);
      i.connect(m);
      m.connect(rect);
      rect.connect(env);
      env.connect(amp);
      amp.connect(band.gain);
      carrier.connect(cf);
      cf.connect(band);
      band.connect(o);
    }
  });
  if (p.chd > 0) par(p.chm, 0, (i, o) => {
    const d = c.createDelay(0.1);
    d.delayTime.value = p.chb / 1000;
    lfo(p.chr, p.chd * p.chb / 1000 * 0.9, d.delayTime);
    i.connect(d);
    d.connect(o);
  });
  if (p.wid > 0) {
    const sp = c.createChannelSplitter(2);
    const m = c.createChannelMerger(2);
    const d = c.createDelay(0.1);
    d.delayTime.value = 0.001 + p.wid * 0.025;
    n.connect(sp);
    sp.connect(m, 0, 0);
    sp.connect(d, 1);
    d.connect(m, 0, 1);
    n = m;
  }
  par(p.dmx, 0, (i, o) => {
    if (p.dpp) {
      // Ping-pong: echoes bounce right, left, right...
      const d1 = c.createDelay(2);
      const d2 = c.createDelay(2);
      const f1 = G_(p.dfb);
      const f2 = G_(p.dfb);
      const m = c.createChannelMerger(2);
      d1.delayTime.value = p.dt;
      d2.delayTime.value = p.dt;
      i.connect(d1);
      d1.connect(m, 0, 1);
      d1.connect(f1);
      f1.connect(d2);
      d2.connect(m, 0, 0);
      d2.connect(f2);
      f2.connect(d1);
      m.connect(o);
      return;
    }
    const d = c.createDelay(2);
    const f = G_(p.dfb);
    d.delayTime.value = p.dt;
    i.connect(d);
    d.connect(f);
    f.connect(d);
    d.connect(o);
  });
  par(p.rmx, 0, (i, o) => {
    const v = c.createConvolver();
    v.buffer = ir(c, p.rsz, p.rdc);
    i.connect(v);
    v.connect(o);
  });
  if (p.th < 0 && p.ratio > 1) {
    const k = add(c.createDynamicsCompressor());
    k.threshold.value = p.th;
    k.ratio.value = p.ratio;
    k.knee.value = 10;
    add(G_(Math.pow(10, p.mk / 20)));
  }
  if (p.lim < 0) {
    const k = add(c.createDynamicsCompressor());
    k.threshold.value = p.lim;
    k.ratio.value = 20;
    k.knee.value = 0;
    k.attack.value = 0.002;
    k.release.value = 0.1;
  }
  add(G_(p.gain));
  const pn = c.createStereoPanner();
  pn.pan.value = p.pan;
  if (p.apd > 0) lfo(p.apr, p.apd, pn.pan);
  add(pn);
  return n;
}
// ---------- Playback ----------
function stopN() {
  if (src) {
    src.onended = null;
    try {
      src.stop();
    } catch (e) {
    }
  }
  oscs.forEach((o) => {
    try {
      o.stop();
    } catch (e) {
    }
  });
  oscs = [];
  src = null;
}
const cpos = () => {
  const d = cur().duration;
  if (!playing) return pos;
  let t = (actx.currentTime - startT) * R();
  if (rng) {
    if (loop && t >= rng.b) t = rng.a + (t - rng.a) % (rng.b - rng.a);
    return Math.min(t, rng.b);
  }
  return loop ? t % d : Math.min(t, d);
};
function play(from) {
  if (!buf) return;
  stopN();
  const c = actx || (actx = new AudioContext());
  c.resume();
  const b = cur();
  const q = byp ? D : p;
  if (from != null) pos = from;
  if (rng && (pos < rng.a || pos >= rng.b - 0.01)) pos = rng.a;
  if (!rng && pos >= b.duration - 0.01) pos = 0;
  src = c.createBufferSource();
  src.buffer = b;
  src.playbackRate.value = prate(q);
  src.loop = loop;
  if (rng) {
    src.loopStart = rng.a;
    src.loopEnd = rng.b;
  }
  mk(c, q, src, oscs).connect(c.destination);
  if (rng && !loop) src.start(0, pos, Math.max(0.01, rng.b - pos));
  else src.start(0, pos);
  startT = c.currentTime - pos / R();
  playing = true;
  src.onended = () => {
    playing = false;
    pos = rng ? rng.a : 0;
    ui();
  };
  ui();
}
function pause() {
  if (playing) {
    pos = cpos();
    stopN();
    playing = false;
    ui();
  }
}
const chg = (f) => {
  if (playing) pos = cpos();
  const k = pk();
  const k0 = effK();
  f();
  if (buf && k != pk()) {
    draw();
    pos = Math.min(pos * effK() / k0, cur().duration - 0.01);
  }
  if (playing) play(pos);
};
function ui() {
  $("#play").textContent = playing ? "❚❚ Pause" : "▶ Play";
  $("#loop").classList.toggle("on", loop);
  $("#rev").classList.toggle("on", !!p.rev);
  $("#byp").classList.toggle("on", byp);
  $("#xb").style.display = $("#xf").value == "mp3" ? "" : "none";
}
const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
(function tick() {
  if (buf) {
    const d = cur().duration;
    const x = cpos();
    $("#ph").style.left = x / d * 100 + "%";
    $("#tm").textContent = fmt(x) + " / " + fmt(d);
    updateSelBox();
  }
  $("#nm").classList.toggle("on", playing && !!buf); // red glow while playing
  requestAnimationFrame(tick);
})();
// ---------- Waveform & loading ----------
function draw() {
  const cv = $("canvas");
  const dp = devicePixelRatio || 1;
  const w = cv.width = cv.clientWidth * dp;
  const h = cv.height = cv.clientHeight * dp;
  const x = cv.getContext("2d");
  x.clearRect(0, 0, w, h);
  if (!buf) return;
  const d = cur().getChannelData(0);
  const st = Math.max(1, Math.floor(d.length / w));
  x.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--ac");
  for (let i = 0; i < w; i++) {
    let mn = 1;
    let mx = -1;
    for (let j = 0; j < st; j += Math.ceil(st / 40)) {
      const v = d[i * st + j] || 0;
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    x.fillRect(i, (1 + mn) * h / 2, 1, Math.max(1, (mx - mn) * h / 2));
  }
}
let curId = null; // library id of the loaded track (null for the demo / unsaved audio)
function setBuf(b, n, id = null) {
  stopN();
  playing = false;
  buf = b;
  cache = null;
  name = n;
  curId = id;
  pos = 0;
  resetHist();
  showName();
  draw();
  ui();
}
async function loadAB(ab, n, save, sw = true, id = null) {
  const c = actx || (actx = new AudioContext());
  let decoded;
  try {
    decoded = await c.decodeAudioData(ab.slice(0));
  } catch (e) {
    return toast("Could not decode " + n);
  }
  if (sw) setBuf(decoded, n, id);
  if (save) {
    try {
      const key = await tx("readwrite", (s) => s.add({ name: n, date: Date.now(), data: ab }));
      if (sw) curId = key;
      lib();
      toast(sw ? "Saved to library" : "Added to library (current track kept)");
    } catch (e) {
      toast("Browser storage unavailable");
    }
  }
}
// ---------- Selection & editing (cut, copy, paste, delete, apply FX to a range) ----------
let sel = null; // selected range { s, e } in seconds of the working audio (before the live effects)
let clip = null; // clipboard (AudioBuffer)
let hist = []; // undo history of the working audio
let hi = -1;
let rng = null; // range being auditioned: { a, b } in display seconds
const FADE = 64; // samples; softens the seams of cuts and pastes
const ft = (t) => Math.floor(t / 60) + ":" + (t % 60).toFixed(2).padStart(5, "0");
function showName() {
  $("#nm").textContent = buf ? name + (hi > 0 ? " (edited)" : "") : "No audio loaded";
}
// The waveform shows the processed audio (trim, reverse, stretch...), the selection is stored on the
// source audio. These two convert between them.
function dispToSrc(t) {
  cur();
  const i = cache.info;
  const j = t * i.sr;
  const m = i.s + i.a + (i.rev ? i.n - j : j);
  return clamp(m / i.k / i.sr, 0, buf.duration);
}
function srcToDisp(t) {
  const d = cur().duration;
  const i = cache.info;
  const j = t * i.sr * i.k - i.s - i.a;
  return clamp((i.rev ? i.n - j : j) / i.sr, 0, d);
}
const chData = (b) => [...Array(b.numberOfChannels)].map((_, c) => b.getChannelData(c));
function mkBuf(A, sr) {
  const o = new AudioBuffer({ length: A[0].length, numberOfChannels: A.length, sampleRate: sr });
  A.forEach((x, c) => o.copyToChannel(x, c));
  return o;
}
const samp = (b, t) => clamp(Math.round(t * b.sampleRate), 0, b.length);
const sliceBuf = (b, s, e) => mkBuf(chData(b).map((x) => x.slice(samp(b, s), samp(b, e))), b.sampleRate);
// Briefly fade both sides of a join so cuts and pastes do not click.
function smoothJoin(y, j) {
  for (let i = 0; i < FADE; i++) {
    if (j - 1 - i >= 0 && j - 1 - i < y.length) y[j - 1 - i] *= i / FADE;
    if (j + i < y.length) y[j + i] *= i / FADE;
  }
}
function matchCh(b, nc) {
  const X = chData(b);
  if (X.length == nc) return X;
  if (nc == 1) {
    const m = new Float32Array(b.length);
    X.forEach((x) => x.forEach((v, i) => m[i] += v / X.length));
    return [m];
  }
  return [...Array(nc)].map((_, c) => X[Math.min(c, X.length - 1)]);
}
function cutRange(b, s, e) {
  const i0 = samp(b, s);
  const i1 = samp(b, e);
  return mkBuf(chData(b).map((x) => {
    const y = new Float32Array(x.length - (i1 - i0));
    y.set(x.subarray(0, i0));
    y.set(x.subarray(i1), i0);
    smoothJoin(y, i0);
    return y;
  }), b.sampleRate);
}
function insertAt(b, at, cl) {
  const i = samp(b, at);
  const C = matchCh(cl, b.numberOfChannels);
  return mkBuf(chData(b).map((x, c) => {
    const y = new Float32Array(x.length + C[c].length);
    y.set(x.subarray(0, i));
    y.set(C[c], i);
    y.set(x.subarray(i), i + C[c].length);
    smoothJoin(y, i);
    smoothJoin(y, i + C[c].length);
    return y;
  }), b.sampleRate);
}
// Replace [i0, i1) with a processed segment; its effect tail is mixed over whatever follows.
function spliceSeg(b, i0, i1, seg, tail, orig) {
  const F = Math.min(FADE, seg[0].length, orig[0].length);
  return mkBuf(chData(b).map((x, c) => {
    const sg = seg[c].slice();
    for (let i = 0; i < F; i++) {
      const w = i / F; // crossfade into / out of the processed segment
      sg[i] = orig[c][i] * (1 - w) + sg[i] * w;
      const j = sg.length - 1 - i;
      sg[j] = orig[c][orig[c].length - 1 - i] * (1 - w) + sg[j] * w;
    }
    const t = tail[c];
    const ext = i1 >= x.length ? t.length : 0;
    const y = new Float32Array(x.length - (i1 - i0) + sg.length + ext);
    y.set(x.subarray(0, i0));
    y.set(sg, i0);
    y.set(x.subarray(i1), i0 + sg.length);
    for (let i = 0; i < t.length && i0 + sg.length + i < y.length; i++) y[i0 + sg.length + i] += t[i];
    return y;
  }), b.sampleRate);
}
function resetHist() {
  hist = [buf];
  hi = 0;
  sel = null;
  rng = null;
  updateEditUI();
}
function useBuf(nb, nsel) {
  stopN();
  playing = false;
  rng = null;
  buf = nb;
  cache = null;
  sel = nsel;
  draw();
  showName();
  updateEditUI();
  ui();
}
function commit(nb, nsel) {
  hist = hist.slice(0, hi + 1);
  hist.push(nb);
  if (hist.length > 10) hist.shift();
  hi = hist.length - 1;
  useBuf(nb, nsel);
}
function undoRedo(dir) {
  const n = hi + dir;
  if (!buf || n < 0 || n >= hist.length) return;
  hi = n;
  pos = 0;
  useBuf(hist[hi], null);
}
function updateEditUI() {
  const has = !!buf;
  const hs = has && !!sel;
  [["#eAll", has], ["#ePlay", hs], ["#eCopy", hs], ["#eCut", hs], ["#eDel", hs], ["#eFx", hs], ["#ePaste", has && !!clip], ["#eUndo", hi > 0], ["#eRedo", hi >= 0 && hi < hist.length - 1]].forEach(([id, on]) => $(id).disabled = !on);
  let t = sel ? `Length ${(sel.e - sel.s).toFixed(2)} s` : has ? selMode == "range" ? "Drag across the waveform to select a range" : "Click the waveform to place the playhead" : "Load audio to start editing";
  if (clip) t += ` · Clipboard ${clip.duration.toFixed(2)} s`;
  $("#selinfo").textContent = t;
  [["#selS", sel && sel.s], ["#selE", sel && sel.e]].forEach(([id, v]) => {
    const el = $(id);
    el.disabled = !has;
    if (document.activeElement !== el) el.value = sel ? v.toFixed(2) : "";
  });
}
// Type exact selection times (seconds, or m:ss.xx) down to 0.01 s. Up/Down nudge by 0.01 (Shift: 0.1).
const parseT = (v) => {
  v = v.trim();
  if (!v) return NaN;
  if (v.includes(":")) {
    const [m, sec] = v.split(":");
    return +m * 60 + +sec;
  }
  return +v;
};
const r2 = (v) => Math.round(v * 100) / 100;
function applyTimes(which, delta = 0) {
  if (!buf) return;
  const dur = r2(buf.duration);
  let s = parseT($("#selS").value);
  let e = parseT($("#selE").value);
  if (which == "selS") {
    if (!Number.isFinite(s)) return updateEditUI();
    if (!Number.isFinite(e)) e = sel ? sel.e : dur;
    s = clamp(r2(s + delta), 0, Math.max(0, dur - 0.01));
    if (e <= s) e = Math.min(dur, r2(s + 0.01));
  } else {
    if (!Number.isFinite(e)) return updateEditUI();
    if (!Number.isFinite(s)) s = sel ? sel.s : 0;
    e = clamp(r2(e + delta), 0.01, dur);
    if (s >= e) s = Math.max(0, r2(e - 0.01));
  }
  sel = { s: r2(s), e: r2(e) };
  rng = null;
  $("#selS").value = sel.s.toFixed(2);
  $("#selE").value = sel.e.toFixed(2);
  updateEditUI();
}
["selS", "selE"].forEach((id) => {
  $("#" + id).onchange = () => applyTimes(id);
  $("#" + id).onkeydown = (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
      e.preventDefault();
      applyTimes(id, (e.key == "ArrowUp" ? 1 : -1) * (e.shiftKey ? 0.1 : 0.01));
    } else if (e.key == "Enter") {
      applyTimes(id);
      e.target.blur();
    }
  };
});
function updateSelBox() {
  const el = $("#sel");
  if (!buf || !sel) {
    el.hidden = true;
    return;
  }
  const d = cur().duration;
  const a = srcToDisp(sel.s);
  const b = srcToDisp(sel.e);
  el.hidden = false;
  el.style.left = Math.min(a, b) / d * 100 + "%";
  el.style.width = Math.abs(b - a) / d * 100 + "%";
}
// Set the selection from two points on the waveform (display seconds).
function setSel(a, b) {
  const lo = Math.min(a, b);
  const hi2 = Math.max(a, b);
  if (hi2 - lo < 0.005) sel = null;
  else {
    const s1 = dispToSrc(lo);
    const s2 = dispToSrc(hi2);
    sel = { s: Math.min(s1, s2), e: Math.max(s1, s2) };
  }
  updateEditUI();
}
const wv = $("#wv");
let drag = null;
const xToDisp = (x) => clamp((x - wv.getBoundingClientRect().left) / wv.clientWidth, 0, 1) * cur().duration;
const selEdges = () => {
  const a = srcToDisp(sel.s);
  const b = srcToDisp(sel.e);
  return [Math.min(a, b), Math.max(a, b)];
};
const edgeAt = (t) => {
  if (!sel) return null;
  const [lo, hi2] = selEdges();
  const tol = 8 / wv.clientWidth * cur().duration;
  return Math.abs(t - lo) < tol ? "lo" : Math.abs(t - hi2) < tol ? "hi" : null;
};
let selMode = "range"; // "range": drag to select. "click": click to place the playhead.
function setMode(m) {
  selMode = m;
  wv.classList.toggle("click", m == "click");
  $("#mRange").classList.toggle("on", m == "range");
  $("#mClick").classList.toggle("on", m == "click");
  $("#mRange").setAttribute("aria-pressed", m == "range");
  $("#mClick").setAttribute("aria-pressed", m == "click");
}
$("#mRange").onclick = () => setMode("range");
$("#mClick").onclick = () => setMode("click");
wv.onpointerdown = (e) => {
  if (!buf) return;
  wv.setPointerCapture(e.pointerId);
  const t = xToDisp(e.clientX);
  if (selMode == "click") {
    // click mode: place (or scrub) the playhead, selection untouched
    drag = { click: true, t };
    if (!playing) pos = t;
    return;
  }
  const edge = edgeAt(t);
  const [lo, hi2] = sel ? selEdges() : [0, 0];
  drag = { x0: e.clientX, t0: t, edge, lo, hi: hi2, moved: false };
};
wv.onpointermove = (e) => {
  if (!buf) return;
  if (!drag) {
    wv.style.cursor = selMode == "range" && edgeAt(xToDisp(e.clientX)) ? "ew-resize" : "";
    return;
  }
  if (drag.click) {
    drag.t = xToDisp(e.clientX);
    if (!playing) pos = drag.t;
    return;
  }
  if (!drag.moved && Math.abs(e.clientX - drag.x0) < 4) return;
  drag.moved = true;
  const t = xToDisp(e.clientX);
  if (drag.edge == "lo") setSel(t, drag.hi);
  else if (drag.edge == "hi") setSel(drag.lo, t);
  else setSel(drag.t0, t);
};
wv.onpointerup = () => {
  if (!drag) return;
  if (drag.click) {
    rng = null;
    if (playing) play(drag.t);
    else pos = drag.t;
    drag = null;
    return;
  }
  if (!drag.moved) {
    // a plain click moves the playhead and clears the selection
    rng = null;
    sel = null;
    updateEditUI();
    if (playing) play(drag.t0);
    else pos = drag.t0;
  }
  drag = null;
};
function doCopy() {
  if (!buf || !sel) return;
  clip = sliceBuf(buf, sel.s, sel.e);
  updateEditUI();
  toast(`Copied ${clip.duration.toFixed(2)} s`);
}
function doDelete(silent) {
  if (!buf || !sel) return;
  const i0 = samp(buf, sel.s);
  const i1 = samp(buf, sel.e);
  if (i1 - i0 >= buf.length - 64) return toast("Select less than the whole track to delete it");
  const at = sel.s;
  const secs = (i1 - i0) / buf.sampleRate;
  commit(cutRange(buf, sel.s, sel.e), null);
  pos = srcToDisp(at);
  if (!silent) toast(`Deleted ${secs.toFixed(2)} s`);
}
function doCut() {
  if (!buf || !sel) return;
  doCopy();
  doDelete(true);
  toast(`Cut ${clip.duration.toFixed(2)} s`);
}
function doPaste() {
  if (!buf || !clip) return;
  if (clip.sampleRate != buf.sampleRate) return toast("Sample rates differ, cannot paste");
  const at = S.paste == "after" && sel ? sel.e : dispToSrc(playing ? cpos() : pos);
  commit(insertAt(buf, at, clip), { s: at, e: at + clip.duration });
  pos = srcToDisp(at);
  toast(`Pasted ${clip.duration.toFixed(2)} s`);
}
// Bake the current effects into the selected range only, then reset the live effects so the rest is untouched.
async function applyToSelection() {
  if (!buf || !sel) return;
  toast("Applying effects to the selection…");
  await new Promise((r) => setTimeout(r, 30));
  stopN();
  playing = false;
  const sr = buf.sampleRate;
  const st = mkBuf(matchCh(buf, 2), sr);
  const i0 = samp(st, sel.s);
  const i1 = samp(st, sel.e);
  const piece = sliceBuf(st, sel.s, sel.e);
  const q = { ...p, ts: 0, te: 100, trim: 0 };
  const wasByp = byp;
  byp = false;
  let pb;
  let out;
  try {
    pb = prep(piece, q);
    out = await renderBuffer(pb, q, sr);
  } catch (e) {
    byp = wasByp;
    return toast("Could not apply the effects");
  }
  byp = wasByp;
  const bodyLen = Math.max(1, Math.round(pb.duration / prate(q) * sr));
  const O = chData(out);
  const nb = spliceSeg(st, i0, i1, O.map((x) => x.slice(0, bodyLen)), O.map((x) => x.slice(bodyLen)), chData(piece));
  const s0 = sel.s;
  commit(nb, { s: s0, e: s0 + bodyLen / sr });
  p = { ...D };
  cp = "";
  syncUI();
  markP();
  pos = srcToDisp(s0);
  toast("Effects applied to the selection (live effects reset)");
}
$("#eAll").onclick = () => {
  if (!buf) return;
  sel = { s: 0, e: buf.duration };
  updateEditUI();
};
$("#ePlay").onclick = () => {
  if (!sel) return;
  const a = srcToDisp(sel.s);
  const b = srcToDisp(sel.e);
  rng = { a: Math.min(a, b), b: Math.max(a, b) };
  play(rng.a);
};
$("#eCopy").onclick = doCopy;
$("#eCut").onclick = doCut;
$("#ePaste").onclick = doPaste;
$("#eDel").onclick = () => doDelete();
$("#eFx").onclick = applyToSelection;
$("#eUndo").onclick = () => undoRedo(-1);
$("#eRedo").onclick = () => undoRedo(1);
// ---------- Library (IndexedDB) ----------
let dbp = null;
const db = () => dbp || (dbp = new Promise((res, rej) => {
  const r = indexedDB.open("spargl-lab", 2);
  r.onupgradeneeded = () => {
    const d = r.result;
    if (!d.objectStoreNames.contains("a")) d.createObjectStore("a", { keyPath: "id", autoIncrement: true }); // tracks
    if (!d.objectStoreNames.contains("p")) d.createObjectStore("p", { keyPath: "id", autoIncrement: true }); // projects
  };
  r.onsuccess = () => res(r.result);
  r.onerror = () => {
    dbp = null;
    rej(r.error);
  };
}));
async function tx(m, f, store = "a") {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(store, m);
    const r = f(t.objectStore(store));
    t.oncomplete = () => res(r.result);
    t.onerror = () => rej(t.error);
  });
}
const savePJ = (pr) => tx("readwrite", (s) => s.put(pr), "p");
let TR = []; // saved tracks
let PJ = []; // projects: { id, name, ids: [trackId, ...], date }
let libTab = "tracks";
async function lib() {
  try {
    TR = (await tx("readonly", (s) => s.getAll())).sort((x, y) => y.date - x.date);
    PJ = (await tx("readonly", (s) => s.getAll(), "p")).sort((x, y) => x.date - y.date);
    renderLib();
  } catch (e) {
    $("#lib").innerHTML = '<li class="mut">Storage unavailable</li>';
  }
}
const mb = (t) => (t.data.byteLength / 1000000).toFixed(2);
// One track row. o.pid: row lives in that project; o.del: show "delete from library"; o.drag: draggable.
const trackRow = (t, o = {}) => `<li class="trk"${o.drag ? ' draggable="true"' : ""} data-t="${t.id}" data-from="${o.pid ?? ""}"><b data-l="${t.id}" title="Click to load">${esc(t.name)}</b><small>${mb(t)} MB</small><button data-rn="${t.id}" title="Rename">✎</button>${o.pid != null ? `<button data-rm="${t.id}" data-pid="${o.pid}" title="Remove from project">✕</button>` : o.del ? `<button data-d="${t.id}" title="Delete from library">✕</button>` : ""}</li>`;
function renderLib() {
  const onT = libTab == "tracks";
  $("#tabT").classList.toggle("on", onT);
  $("#tabP").classList.toggle("on", !onT);
  $("#tabT").setAttribute("aria-selected", onT);
  $("#tabP").setAttribute("aria-selected", !onT);
  $("#lib").hidden = !onT;
  $("#projview").hidden = onT;
  if (onT) {
    $("#lib").innerHTML = TR.length ? TR.map((t) => trackRow(t, { del: true })).join("") : '<li class="mut">Nothing saved yet</li>';
    return;
  }
  const byId = new Map(TR.map((t) => [t.id, t]));
  const projects = PJ.map((pr) => {
    const items = pr.ids.map((id) => byId.get(id)).filter(Boolean);
    return `<div class="proj dz" data-pid="${pr.id}"><div class="ph2"><b data-pn="${pr.id}">${esc(pr.name)}</b><small>${items.length}</small><button data-prn="${pr.id}" title="Rename project">✎</button><button data-pd="${pr.id}" title="Delete project (tracks stay in the library)">✕</button></div><ul class="plist">${items.length ? items.map((t) => trackRow(t, { pid: pr.id, drag: true })).join("") : '<li class="mut hint">Drag tracks here</li>'}</ul></div>`;
  }).join("");
  const pool = `<div class="pool dz" data-pid=""><div class="pt">Library tracks <small>drag into a project, or drop a project track here to take it out</small></div><ul class="plist">${TR.length ? TR.map((t) => trackRow(t, { drag: true })).join("") : '<li class="mut hint">Upload audio to get started</li>'}</ul></div>`;
  $("#pjlist").innerHTML = projects + pool;
}
$("#tabT").onclick = () => {
  libTab = "tracks";
  renderLib();
};
$("#tabP").onclick = () => {
  libTab = "projects";
  renderLib();
};
// Two-click confirmation for destructive buttons.
function armed(b, fn) {
  if (!b.dataset.c) {
    b.dataset.c = 1;
    b.textContent = "Sure?";
    setTimeout(() => {
      if (b.isConnected) {
        b.dataset.c = "";
        b.textContent = "✕";
      }
    }, 3000);
    return;
  }
  fn();
}
// Swap a label for a text box; Enter or clicking away saves, Escape cancels.
function renameInline(el, current, save, after = lib) {
  const inp = document.createElement("input");
  inp.className = "rn";
  inp.value = current;
  inp.maxLength = 80;
  el.replaceWith(inp);
  inp.focus();
  inp.select();
  let done = false;
  const fin = async (ok) => {
    if (done) return;
    done = true;
    const v = inp.value.trim();
    try {
      if (ok && v && v !== current) await save(v);
    } catch (e) {
      toast("Storage error");
    }
    after();
  };
  inp.onkeydown = (e) => {
    if (e.key == "Enter") fin(true);
    else if (e.key == "Escape") fin(false);
  };
  inp.onblur = () => fin(true);
}
async function delTrack(id) {
  await tx("readwrite", (s) => s.delete(id));
  for (const pr of PJ) {
    if (pr.ids.includes(id)) {
      pr.ids = pr.ids.filter((x) => x !== id);
      await savePJ(pr);
    }
  }
  if (curId === id) curId = null;
  lib();
}
$("#libbody").onclick = async (e) => {
  const t = e.target.closest("button, b");
  if (!t) return;
  const ds = t.dataset;
  try {
    if (ds.l) {
      const r = await tx("readonly", (s) => s.get(+ds.l));
      loadAB(r.data, r.name, false, true, r.id);
    } else if (ds.d) {
      armed(t, () => delTrack(+ds.d));
    } else if (ds.rn) {
      const id = +ds.rn;
      const r = TR.find((x) => x.id === id);
      renameInline(t.parentElement.querySelector("b"), r.name, async (v) => {
        const rec = await tx("readonly", (s) => s.get(id));
        rec.name = v;
        await tx("readwrite", (s) => s.put(rec));
        if (curId === id) {
          name = v;
          showName();
        }
      });
    } else if (ds.rm) {
      const pr = PJ.find((x) => x.id === +ds.pid);
      pr.ids = pr.ids.filter((x) => x !== +ds.rm);
      await savePJ(pr);
      lib();
    } else if (ds.prn) {
      const pr = PJ.find((x) => x.id === +ds.prn);
      renameInline(t.parentElement.querySelector("b"), pr.name, async (v) => {
        pr.name = v;
        await savePJ(pr);
      });
    } else if (ds.pd) {
      armed(t, async () => {
        await tx("readwrite", (s) => s.delete(+ds.pd), "p");
        lib();
      });
    }
  } catch (x) {
    toast("Storage error");
  }
};
async function addProject() {
  const n = $("#pjn").value.trim() || `Project ${PJ.length + 1}`;
  $("#pjn").value = ""; // clear right away so quick follow-up typing isn't wiped
  try {
    await tx("readwrite", (s) => s.add({ name: n, ids: [], date: Date.now() }), "p");
    lib();
  } catch (e) {
    toast("Browser storage unavailable");
  }
}
$("#pja").onclick = addProject;
$("#pjn").onkeydown = (e) => {
  if (e.key == "Enter") addProject();
};
// Drag tracks into, between and out of projects.
const pv = $("#projview");
pv.ondragstart = (e) => {
  const li = e.target.closest("li.trk");
  if (!li) return;
  e.dataTransfer.setData("text/plain", JSON.stringify({ t: +li.dataset.t, from: li.dataset.from }));
  e.dataTransfer.effectAllowed = "move";
  li.classList.add("dragging");
};
pv.ondragend = () => document.querySelectorAll(".dragging, .over").forEach((x) => x.classList.remove("dragging", "over"));
pv.ondragover = (e) => {
  const z = e.target.closest(".dz");
  if (!z) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  z.classList.add("over");
};
pv.ondragleave = (e) => {
  const z = e.target.closest(".dz");
  if (z && !z.contains(e.relatedTarget)) z.classList.remove("over");
};
pv.ondrop = async (e) => {
  const z = e.target.closest(".dz");
  if (!z) return;
  e.preventDefault();
  z.classList.remove("over");
  let d;
  try {
    d = JSON.parse(e.dataTransfer.getData("text/plain"));
  } catch (x) {
    return;
  }
  const to = z.dataset.pid;
  if (to === d.from) return;
  try {
    if (d.from) {
      const src = PJ.find((x) => x.id === +d.from);
      if (src) {
        src.ids = src.ids.filter((x) => x !== d.t);
        await savePJ(src);
      }
    }
    if (to) {
      const dst = PJ.find((x) => x.id === +to);
      if (!dst.ids.includes(d.t)) dst.ids.push(d.t);
      await savePJ(dst);
    }
    toast(to ? (d.from ? "Moved to project" : "Added to project") : "Removed from project");
    lib();
  } catch (x) {
    toast("Storage error");
  }
};
async function files(fl) {
  for (const f of fl) await loadAB(await f.arrayBuffer(), f.name, S.save, S.sw || !buf || !S.save);
}
$("#file").onchange = (e) => {
  const list = [...e.target.files];
  e.target.value = ""; // lets the same file be picked again
  files(list);
};
const dr = $("#drop");
dr.ondragover = (e) => {
  e.preventDefault();
  dr.classList.add("h");
};
dr.ondragleave = () => dr.classList.remove("h");
dr.ondrop = (e) => {
  e.preventDefault();
  dr.classList.remove("h");
  files(e.dataTransfer.files);
};
$("#demo").onclick = () => {
  const c = actx || (actx = new AudioContext());
  const sr = c.sampleRate;
  const b = c.createBuffer(1, sr * 4, sr);
  const d = b.getChannelData(0);
  const nt = [220, 277, 330, 440, 330, 277, 220, 165];
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const k = Math.floor(t * 4) % 8;
    const f = nt[k];
    d[i] = ((t * f % 1 * 2 - 1) * 0.22 + Math.sin(6.283 * t * f * 2) * 0.1) * Math.exp(-(t * 4 % 1) * 3) + (Math.random() * 2 - 1) * 0.25 * Math.exp(-(t * 2 % 1) * 18) * (k % 2 ? 0 : 1);
  }
  setBuf(b, "Demo sound");
};
// ---------- Encoders (WAV, MP3, ZIP) ----------
function chs(b, mono) {
  const a = [...Array(b.numberOfChannels)].map((_, i) => b.getChannelData(i));
  if (mono && a.length > 1 || a.length > 2 && false) {
    const m = new Float32Array(b.length);
    a.forEach((x) => x.forEach((v, i) => m[i] += v / a.length));
    return [m];
  }
  return a.length > 2 ? a.slice(0, 2) : a;
}
function wav(b, bits = 16, mono = false) {
  const A = chs(b, mono);
  const ch = A.length;
  const n = b.length;
  const by = bits / 8;
  const o = new DataView(new ArrayBuffer(44 + n * ch * by));
  const w = (a, s) => [...s].forEach((c, i) => o.setUint8(a + i, c.charCodeAt(0)));
  w(0, "RIFF");
  o.setUint32(4, 36 + n * ch * by, true);
  w(8, "WAVEfmt ");
  o.setUint32(16, 16, true);
  o.setUint16(20, bits == 32 ? 3 : 1, true);
  o.setUint16(22, ch, true);
  o.setUint32(24, b.sampleRate, true);
  o.setUint32(28, b.sampleRate * ch * by, true);
  o.setUint16(32, ch * by, true);
  o.setUint16(34, bits, true);
  w(36, "data");
  o.setUint32(40, n * ch * by, true);
  let k = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
    const v = Math.max(-1, Math.min(1, A[c][i]));
    if (bits == 16) o.setInt16(k, v < 0 ? v * 32768 : v * 32767, true);
    else if (bits == 32) o.setFloat32(k, v, true);
    else {
      const x = Math.round(v < 0 ? v * 8388608 : v * 8388607);
      o.setUint8(k, x & 255);
      o.setUint8(k + 1, x >> 8 & 255);
      o.setUint8(k + 2, x >> 16 & 255);
    }
    k += by;
  }
  return o.buffer;
}
function mp3(b, kbps, mono) {
  const A = chs(b, mono);
  const ch = A.length;
  const e = new lamejs.Mp3Encoder(ch, b.sampleRate, kbps);
  const I = A.map((a) => {
    const r = new Int16Array(a.length);
    for (let i = 0; i < a.length; i++) {
      const v = Math.max(-1, Math.min(1, a[i]));
      r[i] = v < 0 ? v * 32768 : v * 32767;
    }
    return r;
  });
  const out = [];
  for (let i = 0; i < I[0].length; i += 1152) {
    const l = I[0].subarray(i, i + 1152);
    const m = ch > 1 ? e.encodeBuffer(l, I[1].subarray(i, i + 1152)) : e.encodeBuffer(l);
    if (m.length) out.push(m);
  }
  const f = e.flush();
  if (f.length) out.push(f);
  return new Blob(out, { type: "audio/mpeg" });
}
function crc(u) {
  const t = crc.t || (crc.t = [...Array(256)].map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    return c >>> 0;
  }));
  let r = -1;
  for (let i = 0; i < u.length; i++) r = t[(r ^ u[i]) & 255] ^ r >>> 8;
  return (r ^ -1) >>> 0;
}
function zip(nm, u) {
  const n = new TextEncoder().encode(nm);
  const c = crc(u);
  const o = new DataView(new ArrayBuffer(30 + n.length + u.length + 46 + n.length + 22));
  const B = new Uint8Array(o.buffer);
  let a = 0;
  const w = (v, s = 2) => {
    s == 2 ? o.setUint16(a, v, true) : o.setUint32(a, v, true);
    a += s;
  };
  w(67324752, 4);
  w(20);
  w(0);
  w(0);
  w(0);
  w(0);
  w(c, 4);
  w(u.length, 4);
  w(u.length, 4);
  w(n.length);
  w(0);
  B.set(n, a);
  a += n.length;
  B.set(u, a);
  a += u.length;
  const cd = a;
  w(33639248, 4);
  w(20);
  w(20);
  w(0);
  w(0);
  w(0);
  w(0);
  w(c, 4);
  w(u.length, 4);
  w(u.length, 4);
  w(n.length);
  w(0);
  w(0);
  w(0);
  w(0);
  w(0, 4);
  w(0, 4);
  B.set(n, a);
  a += n.length;
  w(101010256, 4);
  w(0);
  w(0);
  w(1);
  w(1);
  w(46 + n.length, 4);
  w(cd, 4);
  w(0);
  return o.buffer;
}
async function renderBuffer(b, q, sr) {
  const rate = sr || b.sampleRate;
  const tail = (q.rmx > 0 ? q.rsz + 1 : 0) + (q.dmx > 0 ? Math.min(4, q.dt * 8) : 0);
  const d = b.duration / prate(q);
  const len = Math.ceil((d + tail) * rate);
  const o = new OfflineAudioContext(2, len, rate);
  const s = o.createBufferSource();
  s.buffer = b;
  s.playbackRate.value = prate(q);
  const out = mk(o, q, s, []);
  const f = o.createGain();
  f.gain.setValueAtTime(q.fi > 0 ? 0 : 1, 0);
  if (q.fi > 0) f.gain.linearRampToValueAtTime(1, q.fi);
  if (q.fo > 0) {
    f.gain.setValueAtTime(1, Math.max(q.fi, d - q.fo));
    f.gain.linearRampToValueAtTime(0, d);
  }
  out.connect(f);
  f.connect(o.destination);
  s.start();
  return o.startRendering();
}
async function render(sr) {
  const wasByp = byp;
  byp = false; // always export the processed audio, never the A/B original
  const b = cur();
  byp = wasByp;
  return renderBuffer(b, p, sr);
}
const base = () => (name || "spargl").replace(/\.[^.]+$/, "") + "-fx";
async function saveFile(fn, blob) {
  const dl = await (window.claude ? claude.use("downloads") : Promise.resolve(null)).catch(() => null);
  try {
    if (dl) {
      await dl.save({ filename: fn.replace(/\.[^.]+$/, ".zip"), data: zip(fn, new Uint8Array(await blob.arrayBuffer())) });
      toast("Exported " + fn);
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fn;
      a.click();
    }
  } catch (e) {
    if (!e || e.code !== "declined") toast("Export failed");
  }
}
$("#ex").onclick = async () => {
  if (!buf) return toast("Load a sound first");
  const f = $("#xf").value;
  const mono = $("#xc").value == "1";
  if (f == "mp3" && !window.lamejs) return toast("MP3 encoder failed to load. Try a WAV format.");
  toast("Rendering…");
  let blob;
  let ext;
  try {
    const r = await render(+$("#xs").value);
    await new Promise((x) => setTimeout(x, 40));
    if (f == "mp3") {
      blob = mp3(r, +$("#xq").value, mono);
      ext = "mp3";
    } else {
      blob = new Blob([wav(r, +f.slice(3), mono)], { type: "audio/wav" });
      ext = "wav";
    }
  } catch (e) {
    return toast("Encoding failed: " + (e.message || e));
  }
  saveFile(base() + "." + ext, blob);
};
$("#xf").onchange = ui;
$("#sv").onclick = async () => {
  if (!buf) return toast("Load a sound first");
  try {
    const w = wav(await render());
    await tx("readwrite", (s) => s.add({ name: base() + ".wav", date: Date.now(), data: w }));
    lib();
    toast("Processed audio saved to library");
  } catch (e) {
    toast("Browser storage unavailable");
  }
};
// ---------- UI wiring ----------
function syncUI() {
  document.querySelectorAll("#fx [data-k]").forEach((i) => {
    const v = p[i.dataset.k];
    if (i.type == "checkbox") i.checked = !!v;
    else if (i.tagName == "SELECT") i.value = v;
    else {
      i.value = v;
      i.nextElementSibling.value = +(+v).toFixed(3);
    }
  });
  ui();
}
const CM = {};
G.forEach((g) => g[1].forEach((c) => CM[c[0]] = c));
const stepFor = (c) => c[6] || c[0] == "bits" ? 1 : c[3] - c[2] >= 10 ? S.step : Math.max(S.step / 10, 0.001);
function applyStep() {
  document.querySelectorAll("#fx input[type=range]").forEach((r) => {
    r.step = stepFor(CM[r.dataset.k]);
  });
  syncUI();
}
$("#fx").innerHTML = G.map((g) => `<section class="card"><h3>${g[0]}</h3><div class="body">${g[1].map((c) => c[6] == "s" ? `<div class="row"><label>${c[1]}</label><select data-k="${c[0]}">${c[7].map((o, i) => `<option value="${i}">${o}</option>`).join("")}</select><span></span></div>` : c[6] ? `<div class="row"><label>${c[1]}</label><input type="checkbox" data-k="${c[0]}"><span></span></div>` : `<div class="row"><label>${c[1]}</label><input type="range" data-k="${c[0]}" min="${c[2]}" max="${c[3]}" step="${stepFor(c)}" value="${c[4]}"><input type="number" class="num" data-n="${c[0]}" min="${c[2]}" max="${c[3]}" step="any" value="${c[4]}"></div>`).join("")}</div></section>`).join("");
$("#fx").onclick = (e) => {
  const h = e.target.closest("h3");
  if (h) h.parentElement.classList.toggle("min");
};
$("#fxc").onclick = (e) => {
  const cs = [...document.querySelectorAll("#fx .card")];
  const all = cs.every((c) => c.classList.contains("min"));
  cs.forEach((c) => c.classList.toggle("min", !all));
  e.target.textContent = all ? "Collapse all effects" : "Expand all effects";
};
// Keeps speed and pitch in step while they are locked together.
function setVal(k, v) {
  p[k] = v;
  if (p.lock && (k === "speed" || k === "pitch" || k === "lock")) {
    if (k === "pitch") p.speed = clamp(Math.pow(2, v / 12), 0.25, 3);
    p.pitch = +(12 * Math.log2(p.speed)).toFixed(2);
  }
}
// Unlocked speed/pitch needs a time-stretch, so it is applied on release.
// Auto-tune and harmonizer rebuild the whole audio, so like unlocked speed/pitch they apply on release.
const HEAVY = ["atm", "atk", "ats", "atr", "hmi", "hmm"];
const heavy = (k) => HEAVY.includes(k) || (k === "speed" || k === "pitch") && !p.lock;
const later = (fn) => {
  toast("Applying…");
  setTimeout(fn, 30);
};
function apply(k, v) {
  chg(() => setVal(k, v));
  if (p.lock && (k === "speed" || k === "pitch" || k === "lock")) syncUI();
  cp = "";
  markP();
}
$("#fx").oninput = (e) => {
  const t = e.target;
  const k = t.dataset.k;
  if (!k) return;
  const v = t.type == "checkbox" ? +t.checked : +t.value;
  if (t.type == "range") t.nextElementSibling.value = +v.toFixed(3);
  if (heavy(k)) return;
  apply(k, v);
};
$("#fx").onchange = (e) => {
  const t = e.target;
  if (t.dataset.k && (t.type == "range" || t.tagName == "SELECT") && heavy(t.dataset.k)) {
    const k = t.dataset.k;
    const v = +t.value;
    return later(() => apply(k, v));
  }
  const k = t.dataset.n;
  if (!k) return;
  let v = +t.value;
  if (t.value === "" || isNaN(v)) v = p[k];
  v = Math.min(+t.max, Math.max(+t.min, v));
  const done = () => {
    apply(k, v);
    t.value = +p[k].toFixed(3);
    t.previousElementSibling.value = p[k];
  };
  if (heavy(k)) later(done);
  else done();
};
const markP = () => document.querySelectorAll("#pre button[data-p]").forEach((b) => {
  const on = b.dataset.p === cp;
  b.classList.toggle("on", on);
  b.closest(".pchip")?.classList.toggle("cur", on);
});
// ---------- Presets: custom folders, pins, import / export (.spgl) ----------
let CUSTOM = Object.create(null); // custom presets: name -> settings that differ from the defaults
try {
  Object.assign(CUSTOM, JSON.parse(localStorage.getItem("spargl-custom")) || {});
} catch (e) {}
// META: folders (names, in creation order), where[name] = folder of a custom preset, pins = preset keys
let META = { folders: [], where: Object.create(null), pins: [] };
try {
  const m = JSON.parse(localStorage.getItem("spargl-meta"));
  if (m) META = { folders: m.folders || [], where: Object.assign(Object.create(null), m.where), pins: m.pins || [] };
} catch (e) {}
const saveCustom = () => {
  try {
    localStorage.setItem("spargl-custom", JSON.stringify(CUSTOM));
  } catch (e) {
    toast("Could not store the preset in this browser");
  }
};
const saveMeta = () => {
  try {
    localStorage.setItem("spargl-meta", JSON.stringify(META));
  } catch (e) {
    toast("Could not store the folders in this browser");
  }
};
const COLL = new Set(); // collapsed sections
let lastFolder = ""; // folder chosen in the save form
const UNFILED = "Custom Presets";
// A preset key is its name for built-in presets and "c:" + name for custom ones.
const getPreset = (key) => key.startsWith("c:") ? CUSTOM[key.slice(2)] : PF[key];
const isPinned = (k) => META.pins.includes(k);
const folderOf = (n) => META.folders.includes(META.where[n]) ? META.where[n] : "";
const nameOfKey = (k) => k.startsWith("c:") ? k.slice(2) : k;
function togglePin(k) {
  META.pins = isPinned(k) ? META.pins.filter((x) => x != k) : [...META.pins, k];
  saveMeta();
}
function chip(key, custom) {
  const pin = isPinned(key);
  const n = esc(nameOfKey(key));
  const k = esc(key);
  return `<span class="pchip${pin ? " pinned" : ""}"><button class="pin" data-pin="${k}" title="${pin ? "Unpin" : "Pin to the top of its section"}">${pin ? "★" : "☆"}</button><button class="pb" data-p="${k}">${n}</button><span class="pm"><button data-px="${k}" title="Export this preset (.spgl)">⤓</button>${custom ? `<button data-pmv="${n}" title="Move to a folder">⇄</button><button class="cx" data-cx="${n}" title="Delete preset">✕</button>` : ""}</span></span>`;
}
// Pinned presets float to the top of their own section.
function section(id, title, keys, o = {}) {
  const ordered = [...keys.filter(isPinned), ...keys.filter((k) => !isPinned(k))];
  const body = ordered.length ? `<div class="chips">${ordered.map((k) => chip(k, o.custom)).join("")}</div>` : `<p class="mut hint">${o.empty}</p>`;
  return `<div class="psec${COLL.has(id) ? " min" : ""}" data-sec="${esc(id)}"><div class="psh"><button class="tg" data-tg="${esc(id)}" title="Collapse or expand">▾</button><span class="pst">${esc(title)}</span><small>${keys.length}</small>${o.actions || ""}</div>${body}</div>`;
}
function renderPresets() {
  const st = $("#pre").scrollTop;
  const mine = (f) => Object.keys(CUSTOM).filter((n) => folderOf(n) == f).map((n) => "c:" + n);
  let html = section("sec:custom", UNFILED, mine(""), { custom: 1, empty: "Nothing here yet. Adjust the effects, then press Save preset." });
  html += META.folders.map((f) => section("f:" + f, f, mine(f), { custom: 1, empty: "Empty folder. Save a preset into it.", actions: `<button class="pa2" data-fr="${esc(f)}" title="Rename folder">✎</button><button class="pa2" data-fd="${esc(f)}" title="Delete folder (its presets move to Custom Presets)">✕</button>` })).join("");
  html += Object.entries(PC).map(([c, o]) => section("b:" + c, c, Object.keys(o))).join("");
  $("#pre").innerHTML = html;
  markP();
  filterPresets();
  refreshFolderSelect();
  $("#pre").scrollTop = st;
}
function refreshFolderSelect() {
  if (lastFolder && !META.folders.includes(lastFolder)) lastFolder = "";
  $("#psfld").innerHTML = `<option value="">${UNFILED}</option>` + META.folders.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join("");
  $("#psfld").value = lastFolder;
}
function filterPresets() {
  const q = $("#ps").value.toLowerCase();
  document.querySelectorAll("#pre .psec").forEach((sec) => {
    const title = sec.querySelector(".pst").textContent.toLowerCase();
    let any = 0;
    sec.querySelectorAll(".pchip").forEach((c) => {
      const m = c.querySelector(".pb").textContent.toLowerCase().includes(q) || title.includes(q);
      c.style.display = m ? "" : "none";
      any += m;
    });
    sec.style.display = !q || any ? "" : "none";
    sec.classList.toggle("force", !!q);
  });
}
$("#ps").oninput = filterPresets;
// ---- folders ----
function folderError(v, except) {
  if (!v) return "Give the folder a name";
  if (v.toLowerCase() == UNFILED.toLowerCase() || PC[v]) return "That name is already used by a built-in section";
  if (META.folders.some((f) => f.toLowerCase() == v.toLowerCase() && f != except)) return "A folder with that name already exists";
  return "";
}
function openForm(id) {
  ["#psf", "#pff"].forEach((x) => $(x).hidden = x != id);
  if (id) {
    const inp = $(id).querySelector("input");
    inp.value = "";
    inp.focus();
  }
}
$("#pnf").onclick = () => openForm("#pff");
$("#pfno").onclick = () => openForm(null);
$("#pfn").onkeydown = (e) => {
  if (e.key == "Enter") $("#pfok").click();
  else if (e.key == "Escape") openForm(null);
};
$("#pfok").onclick = () => {
  const v = $("#pfn").value.trim().slice(0, 30);
  const err = folderError(v);
  if (err) return toast(err);
  META.folders.push(v);
  lastFolder = v;
  saveMeta();
  openForm(null);
  renderPresets();
  toast(`Folder "${v}" created`);
};
function renameFolder(f, v) {
  v = v.trim().slice(0, 30);
  const err = folderError(v, f);
  if (err) return toast(err);
  META.folders = META.folders.map((x) => x == f ? v : x);
  for (const n of Object.keys(META.where)) if (META.where[n] == f) META.where[n] = v;
  if (lastFolder == f) lastFolder = v;
  if (COLL.delete("f:" + f)) COLL.add("f:" + v);
  saveMeta();
}
function deleteFolder(f) {
  META.folders = META.folders.filter((x) => x != f);
  for (const n of Object.keys(META.where)) if (META.where[n] == f) META.where[n] = "";
  saveMeta();
  renderPresets();
  toast(`Folder "${f}" deleted (its presets moved to ${UNFILED})`);
}
function moveInline(chipEl, name) {
  const sel = document.createElement("select");
  sel.className = "mvsel";
  sel.innerHTML = `<option value="">${UNFILED}</option>` + META.folders.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join("");
  sel.value = folderOf(name);
  chipEl.replaceWith(sel);
  sel.focus();
  sel.onchange = () => {
    META.where[name] = sel.value;
    saveMeta();
    renderPresets();
    toast(`Moved "${name}" to ${sel.value || UNFILED}`);
  };
  sel.onblur = renderPresets;
}
function deleteCustom(n) {
  delete CUSTOM[n];
  delete META.where[n];
  META.pins = META.pins.filter((k) => k != "c:" + n);
  saveCustom();
  saveMeta();
  if (cp == "c:" + n) cp = "";
  renderPresets();
}
// ---- export / import (.spgl = JSON) ----
function entryFor(key) {
  if (key.startsWith("c:")) {
    const n = key.slice(2);
    return { name: n, settings: { ...CUSTOM[n] }, folder: folderOf(n) || UNFILED, pinned: isPinned(key) };
  }
  const cat = Object.keys(PC).find((c) => key in PC[c]);
  return { name: key, settings: { ...PC[cat][key] }, folder: cat, pinned: isPinned(key) };
}
const allKeys = () => [...Object.keys(CUSTOM).map((n) => "c:" + n), ...Object.values(PC).flatMap(Object.keys)];
function exportPresets(keys, fname) {
  const data = { app: "SPARGL: AUDIO LAB", type: "presets", version: 1, presets: keys.map(entryFor) };
  saveFile(fname, new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
}
const fileSafe = (n) => n.replace(/[^\w\- ]+/g, "_").trim() || "preset";
function cleanSettings(o) {
  const out = {};
  if (o && typeof o == "object") {
    for (const k in o) {
      const v = +o[k];
      if (k in D && Number.isFinite(v)) out[k] = CM[k] ? clamp(v, CM[k][2], CM[k][3]) : v;
    }
  }
  return out;
}
async function importFile(f) {
  let data;
  try {
    data = JSON.parse(await f.text());
  } catch (e) {
    return toast("That is not a valid .spgl file");
  }
  const list = data && Array.isArray(data.presets) ? data.presets : null;
  if (!list) return toast("No presets found in that file");
  let added = 0;
  let pinned = 0;
  for (const e of list) {
    if (!e || typeof e.name != "string" || !e.name.trim()) continue;
    const name = e.name.trim().slice(0, 40);
    const folder = typeof e.folder == "string" ? e.folder.trim() : "";
    if (PC[folder] && name in PC[folder]) {
      // a built-in preset: only its pin carries over
      if (!!e.pinned != isPinned(name)) togglePin(name);
      if (e.pinned) pinned++;
      continue;
    }
    let f2 = "";
    if (folder && folder.toLowerCase() != UNFILED.toLowerCase() && !PC[folder]) {
      f2 = META.folders.find((x) => x.toLowerCase() == folder.toLowerCase()) || folder.slice(0, 30);
      if (!META.folders.includes(f2)) META.folders.push(f2);
    }
    CUSTOM[name] = cleanSettings(e.settings);
    META.where[name] = f2;
    if (!!e.pinned != isPinned("c:" + name)) togglePin("c:" + name);
    if (e.pinned) pinned++;
    added++;
  }
  saveCustom();
  saveMeta();
  renderPresets();
  toast(`Imported ${added} preset${added == 1 ? "" : "s"}${pinned ? `, ${pinned} pinned` : ""}`);
}
$("#pexp").onclick = () => exportPresets(allKeys(), "spargl-presets.spgl");
$("#pimp").onclick = () => $("#pfile").click();
$("#pfile").onchange = async (e) => {
  const f = e.target.files[0];
  e.target.value = "";
  if (f) await importFile(f);
};
$("#pman").onclick = () => {
  const on = $("#pre").classList.toggle("manage");
  $("#pman").classList.toggle("on", on);
};
// ---- clicks on the preset list ----
$("#pre").onclick = (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  const ds = t.dataset;
  if (ds.tg) {
    COLL.has(ds.tg) ? COLL.delete(ds.tg) : COLL.add(ds.tg);
    return t.closest(".psec").classList.toggle("min");
  }
  if (ds.pin) {
    togglePin(ds.pin);
    return renderPresets();
  }
  if (ds.px) return exportPresets([ds.px], fileSafe(nameOfKey(ds.px)) + ".spgl");
  if (ds.pmv) return moveInline(t.closest(".pchip"), ds.pmv);
  if (ds.cx) return armed(t, () => deleteCustom(ds.cx));
  if (ds.fr) return renameInline(t.closest(".psh").querySelector(".pst"), ds.fr, (v) => renameFolder(ds.fr, v), renderPresets);
  if (ds.fd) return armed(t, () => deleteFolder(ds.fd));
  if (!ds.p) return;
  cp = ds.p;
  applyParams({ ...D, ...getPreset(ds.p) }, S.auto);
  markP();
};
// ---- saving the current settings as a custom preset ----
function openSave(show) {
  openForm(show ? "#psf" : null);
}
$("#psv").onclick = () => openSave(true);
$("#psno").onclick = () => openSave(false);
$("#psn").onkeydown = (e) => {
  if (e.key == "Enter") $("#psok").click();
  else if (e.key == "Escape") openSave(false);
};
$("#psok").onclick = () => {
  const n = $("#psn").value.trim();
  if (!n) return toast("Give your preset a name");
  const o = {};
  for (const k in D) if (p[k] !== D[k]) o[k] = p[k]; // store only what differs from the defaults
  if (!Object.keys(o).length) return toast("Nothing to save yet. Adjust some effects first");
  const f = $("#psfld").value;
  const had = n in CUSTOM;
  CUSTOM[n] = o;
  META.where[n] = f;
  lastFolder = f;
  COLL.delete(f ? "f:" + f : "sec:custom");
  saveCustom();
  saveMeta();
  cp = "c:" + n;
  renderPresets();
  openSave(false);
  toast(`Preset "${n}" ${had ? "updated" : "saved"}${f ? ` in ${f}` : ""}`);
};
// Swap in a whole new parameter set (preset or reset) without losing the playback position.
function applyParams(np, autoplay) {
  const was = playing;
  if (was) pos = cpos();
  const k0 = effK();
  const rev0 = !!p.rev;
  byp = false;
  p = np;
  if (buf) {
    const d = cur().duration;
    pos *= effK() / k0; // keep the same spot if the time-stretch changed
    if (rev0 != !!p.rev) pos = d - pos; // reverse mirrors the timeline
    pos = clamp(pos, 0, Math.max(0, d - 0.01));
    draw();
  }
  syncUI();
  if (buf && (was || autoplay)) play(pos);
}
let rstT;
$("#rst").onclick = () => {
  const msg = $("#rstmsg");
  msg.hidden = false;
  clearTimeout(rstT);
  rstT = setTimeout(() => msg.hidden = true, 5000);
  cp = "";
  applyParams({ ...D }, false);
  markP();
};
$("#rev").onclick = () => {
  if (!buf) return;
  chg(() => {
    pos = cur().duration - pos;
    p.rev = p.rev ? 0 : 1;
  });
  cp = "";
  markP();
  ui();
};
$("#byp").onclick = () => {
  if (!buf) return;
  if (playing) pos = cpos();
  const od = cur().duration;
  byp = !byp;
  pos = pos * cur().duration / od;
  draw();
  if (playing) play(pos);
  ui();
};
$("#loop").onclick = () => {
  loop = !loop;
  if (src) src.loop = loop;
  ui();
};
$("#play").onclick = () => buf ? playing ? pause() : (rng = null, play()) : toast("Load a sound first");
$("#stop").onclick = () => {
  rng = null;
  stopN();
  playing = false;
  pos = 0;
  ui();
};
document.onkeydown = (e) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
  if (e.code == "Space" && !typing && e.target.tagName != "BUTTON") {
    e.preventDefault();
    $("#play").click();
  }
  if (typing) return;
  const mod = e.ctrlKey || e.metaKey;
  const k = e.key.toLowerCase();
  if ((e.key == "Delete" || e.key == "Backspace") && sel) {
    e.preventDefault();
    doDelete();
  } else if (mod && k == "c" && sel) {
    e.preventDefault();
    doCopy();
  } else if (mod && k == "x" && sel) {
    e.preventDefault();
    doCut();
  } else if (mod && k == "v" && clip) {
    e.preventDefault();
    doPaste();
  } else if (mod && k == "z") {
    e.preventDefault();
    undoRedo(e.shiftKey ? 1 : -1);
  } else if (mod && k == "y") {
    e.preventDefault();
    undoRedo(1);
  }
};
function syncS() {
  $("#sth").value = S.theme;
  $("#sst").value = String(S.step);
  $("#sau").checked = S.auto;
  $("#ssw").checked = S.sw;
  $("#spp").value = S.paste;
  $("#ssv").checked = S.save;
}
$("#gear").onclick = () => {
  syncS();
  $("#md").hidden = false;
};
$("#scl").onclick = () => {
  $("#md").hidden = true;
};
$("#md").onclick = (e) => {
  if (e.target.id == "md") $("#md").hidden = true;
};
addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    $("#md").hidden = true;
    $("#lg").hidden = true;
  }
});
$("#sth").onchange = (e) => {
  S.theme = e.target.value;
  saveS();
  applyTheme();
  draw();
};
$("#sst").onchange = (e) => {
  S.step = +e.target.value;
  saveS();
  applyStep();
};
$("#spp").onchange = (e) => {
  S.paste = e.target.value;
  saveS();
};
$("#sau").onchange = (e) => {
  S.auto = e.target.checked;
  saveS();
};
$("#ssw").onchange = (e) => {
  S.sw = e.target.checked;
  saveS();
};
$("#ssv").onchange = (e) => {
  S.save = e.target.checked;
  saveS();
};
$("#srs").onclick = () => {
  S = { ...SD };
  saveS();
  syncS();
  applyTheme();
  applyStep();
  draw();
  toast("Settings reset");
};
// ---------- Update log (entries are written in updates.js) ----------
function renderLog() {
  const rows = typeof UPDATE_LOG === "undefined" ? [] : UPDATE_LOG;
  $("#loglist").innerHTML = rows.length ? rows.map((x) => {
    const when = new Date(x.date + "T00:00:00");
    const label = isNaN(when) ? esc(String(x.date)) : when.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    return `<article class="entry"><div class="eh"><b>v${esc(String(x.v))}</b><time>${label}</time></div><ul>${x.changes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></article>`;
  }).join("") : '<p class="mut">No updates yet.</p>';
}
$("#logbtn").onclick = () => {
  renderLog();
  $("#lg").hidden = false;
};
$("#lgx").onclick = () => {
  $("#lg").hidden = true;
};
$("#lg").onclick = (e) => {
  if (e.target.id == "lg") $("#lg").hidden = true;
};

let cf = 0;
$("#sclr").onclick = async (e) => {
  const b = e.target;
  if (!cf) {
    cf = 1;
    b.textContent = "Click again to confirm";
    setTimeout(() => {
      cf = 0;
      b.textContent = "Clear saved library";
    }, 3000);
    return;
  }
  cf = 0;
  b.textContent = "Clear saved library";
  try {
    await tx("readwrite", (s) => s.clear());
    await tx("readwrite", (s) => s.clear(), "p");
    lib();
    toast("Library cleared");
  } catch (x) {
    toast("Storage error");
  }
};
addEventListener("resize", draw);
applyTheme();
applyStep();
renderPresets();
lib();
