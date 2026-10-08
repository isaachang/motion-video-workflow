<p align="center">
  <a href="CHANGELOG.md">简体中文</a> · <b>English</b>
</p>

# Changelog

Every version and what changed in it, newest first. Versions look like `major.minor.patch`:

- Minor (`0.x.0`): new components, tools, or workflow steps
- Patch (`0.x.y`): fixes and polish
- Until 1.0, component APIs can still change. Anything that breaks existing code gets its own "Breaking changes" section — skim it before you upgrade.

## [0.3.1] - 2026-10-07

### Improved
- Both phone components now use iPhone 18 Pro Max proportions: `CallScreen` goes from 560×980 to 440×956, gets a Dynamic Island, and shares the same bezel as `Phone`
- Bubbles in both phone components follow iOS layout: width hugs the text, maxes out at 75%, and only then wraps. Consecutive messages from the same person sit tight together, a new speaker gets more space, and only the last bubble in a run has a tail
- `CallScreen` bubbles are true to scale now (17px) — you read them by pushing in. New `cs.bubAt(i)` returns the center of bubble i, ready to drop into `camKeys`
- In `CallScreen`, your own messages (`me`) sit on the right in the accent color with white text, and the other side (`them`) sits on the left in light gray, same as iOS

### Breaking changes
- `CallScreen`'s `bubbles` entries no longer take a 4th `top` value — bubbles stack automatically. Use the new `chatTop` option to set where the stack starts (default 520)
- Don't hand-break bubble text with `<br>` anymore; let it wrap
- `me` and `them` swapped sides. If old code assumed `me` was on the left, flip it

### Docs
- Added an English README, with a language switcher between the two
- Added this changelog, and a version badge at the top of the README

## [0.3.0] - 2026-10-06

### Added
- Mascot pack `packs/mascot.js`: `Char` pops a transparent character in, peeks it from an edge, or keeps it gently floating; `SoftShot` gives a soft gradient camera backdrop
- `CallScreen` call UI in `product-ui` — its avatar circle works directly as a shape-match transition target
- `tools/key_video.py`: keys a white-background animation into a transparent PNG sequence, keeping white parts of the character and cutting out enclosed holes
- `tools/sheet.py`: keyframe overview sheet, each cell labeled with its timestamp and voice-over line

### Improved
- `capture.py` no longer waits for networkidle, so sites with long-lived connections stop timing out
- A missing Chinese font now throws an error instead of silently falling back to a serif font
- SKILL.md: how to handle voice-overs that come with their own music, a note that setup must run first, and a "decide later" option for cover titles

## [0.2.0] - 2026-10-05

### Added
- Camera transition pack `packs/transition.js`: push-through, pull-out reveal, whip pan, shape match, foreground wipe, and focus pull — 6 camera-continuous transitions where both shots share one easing curve
- A 30-second transition demo, plus source for every demo asset in the README (all code-generated, all fictional)

### Improved
- Motion blur goes up to 8 sub-frames (from 4), so fast whip pans no longer ghost
- SKILL.md: the shot list gets a "transition" column — when to cut, which transition, and how often

### Docs
- README rewrite: animated hero, six superpowers (each with a GIF), pipeline diagram, comparison table, and full feature list

## [0.1.0] - 2026-10-05

First release: one voice-over in, one frame-by-frame, code-rendered motion video out.

- Full workflow in `SKILL.md`: transcription, asset capture, shot list, coded animation, and rendering — 9:16 / 16:9 video plus 3:4 / 4:3 covers
- `motion-kit` engine with 7 component packs: explainer, news, tutorial, product UI, vertical, real web pages, and outro
- 5 vertical (9:16) frame shells
- Toolchain: audio mix, offline word-level transcription, beat detection, auto-generated music, web capture, frame preview, parallel segment rendering, HEVC encode, cover export
- A 12-image showcase wall

[0.3.1]: https://github.com/isaachang/motion-video-workflow/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/isaachang/motion-video-workflow/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/isaachang/motion-video-workflow/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/isaachang/motion-video-workflow/releases/tag/v0.1.0
