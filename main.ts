// Warning Label for Humans: One Line, Big Laugh — make.fun bounty
// u-0xb3e689-warning-label-for-humans-one-line-big-laugh-40e31f85
//
// The entry is one single-line safety warning label that should come
// printed on every human being, at most 160 characters, funny first
// and plausible second. A judge model reads two labels at a time and
// picks the funnier one. The program writes that one label, and
// nothing else, deterministically, to /output/entry.txt.
//
// Candidate labels weighed against the judge's brief, in the order
// the brief weighs them (a warning label for humans first, then the
// laugh landing in the last few words, then recognition of how
// humans actually behave, then real printed-label wording, then
// tightness inside 160 characters):
//   1. "CAUTION: Human may nod along to instructions they did not
//      hear, then do it wrong with total confidence." — 103
//      characters. Recognition is the strongest of the set: every
//      human has nodded along to words they missed and then carried
//      on, confidently wrong. The turn lands in the last two words
//      ("total confidence") and flips the whole scene — the nod was
//      not understanding, it was performance. "CAUTION: ... may ..."
//      is real printed-label language. One joke, one sentence.
//      THE PICK (v1).
//   2. "WARNING: Contents: one (1) brain, two (2) conflicting
//      opinions, zero (0) idea where the charger is." — 99
//      characters. The numbered-contents format is unmistakably a
//      printed label, and "zero (0) idea where the charger is" is
//      a clean turn. Loses to the pick on recognition: losing a
//      charger is a habit, nodding along is a whole human operating
//      mode.
//   3. "WARNING: Human runs on caffeine, confidence, and the firm
//      belief that the instructions do not apply to them." — 108
//      characters. Three fuels, and the turn ("instructions do not
//      apply to them") is true of everyone. Loses to the pick on
//      the turn: it arrives as a list, not as a flip in the last
//      few words.
//   4. "WARNING: Human may suddenly remember an embarrassing moment
//      from 2007 and go quiet for no reason." — 97 characters.
//      Sharp recognition, but "from 2007" dates the joke and the
//      turn ("go quiet for no reason") is softer than the pick's
//      confident wrongness.
//   5. "WARNING: Human operates best after 11 p.m., remembers
//      nothing before coffee, and will absolutely touch the wet
//      paint." — 117 characters. Two ideas in one line (night-owl
//      energy plus wet paint) where the brief wants one joke; the
//      paint beat is a second joke crowding the first.
//   6. "CAUTION: Contents under pressure. Human may explode into a
//      TED Talk if asked about their hobby." — 95 characters.
//      "Contents under pressure" is real label language and the
//      explosion image is vivid, but the turn depends on knowing
//      what a TED Talk is — narrower recognition than the pick.
//   7. "WARNING: This human will say 'I'm five minutes away' from
//      the couch." — 68 characters. A classic, instantly
//      recognisable lie, but too short: the brief wants the line
//      used, and one short clause leaves most of it empty.
//   8. "WARNING: Do not shake. Human has strong opinions about
//      things they have never tried and will defend them loudly."
//      — 112 characters. True, but "Do not shake" is borrowed
//      label language that does not fit a person, and the turn is
//      smeared across the second half instead of arriving last.
//
// The program writes that one label, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen label: one sentence, 103 characters, turn last.
const LABEL =
  "CAUTION: Human may nod along to instructions they did not hear, then do it wrong with total confidence.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 160
// characters, not only white space. Check the label before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LABEL].length;
if (chars < 1 || chars > 160) {
  console.error(`label is ${chars} characters, must be 1-160`);
  process.exit(1);
}
if (LABEL.trim().length === 0) {
  console.error("label must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LABEL)) {
  console.error("label must not contain control characters");
  process.exit(1);
}
// A warning label is one line: a single line, no newline smuggled
// into the text.
if (LABEL.includes("\n") || LABEL.includes("\r")) {
  console.error("label must be a single line");
  process.exit(1);
}
// A deadpan label is filed in earnest: it holds at least two words,
// ends with terminal punctuation, and carries no exclamation mark
// doing the work for it.
// REVISION (v2): the label must also open with a real printed-label
// signal word — "WARNING:" or "CAUTION:" — so the label framing is
// part of the text the judge reads, not something assumed from
// outside it; and the candidate character counts in the comments
// above were corrected to the measured values.
if (!/^(WARNING|CAUTION): /.test(LABEL)) {
  console.error('label must open with "WARNING:" or "CAUTION:"');
  process.exit(1);
}
if (LABEL.trim().split(/\s+/).length < 2) {
  console.error("label must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LABEL)) {
  console.error("label must end with terminal punctuation");
  process.exit(1);
}
if (LABEL.includes("!")) {
  console.error("label must not lean on an exclamation mark");
  process.exit(1);
}
if (LABEL !== LABEL.trim()) {
  console.error("label must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LABEL, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// label: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LABEL) {
  console.error("entry.txt does not match the label");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 160) {
  console.error("entry.txt must be 1-160 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the label's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one label and nothing else.
const expectedBytes = Buffer.from(LABEL, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the label exactly");
  process.exit(1);
}
