# Sound Effect Credits

All UI sound effects shipped under `/sounds/` are **synthesized in-house**
with [jsfxr](https://github.com/chr15m/jsfxr) — a Node port of Tomas
Pettersson's [sfxr](http://www.drpetter.se/project_sfxr.html).

**License of synthesized audio:** Original work — no third-party license
applies. Free to use, modify, and redistribute within this project.

**jsfxr license:** [ISC](https://github.com/chr15m/jsfxr/blob/main/LICENSE)
(equivalent to MIT/BSD — permissive, attribution appreciated).

## Why synthesize instead of downloading a pack

UI sound packs either have unclear origins, retro 8-bit aesthetics, or
license terms that may be revoked. Synthesizing gives us:

- **100% original** audio — no attribution chain, no revocation risk.
- **Tunable character** — every envelope, frequency, and filter is set
  to taste rather than picked from a generic pool.
- **Tiny payload** — total shipped audio is ~40 KB MP3 + ~55 KB OGG.

## Generation pipeline

```bash
# From /tmp/sound-scout/generate.js
node generate.js ./out
# → 9 × WAV (22 kHz mono) via sfxr.toWave
# → MP3 (96 kbps mono) + OGG (Vorbis q4) via ffmpeg
```

Each effect is built from an sfxr preset (`blipSelect`, `pickupCoin`,
`hitHurt`, `powerUp`) and then retuned with explicit envelope,
frequency, and low-pass parameters for a soft modern feel. Waveform is
**always sine** (`wave_type=2`) — never harsh square waves, never noisy
8-bit chirps.

## Mapping

| App effect       | sfxr base preset | Character                             |
| ---------------- | ---------------- | ------------------------------------- |
| `tap`            | `blipSelect`     | 18 ms soft tactile blip               |
| `toggle`         | `blipSelect`     | 28 ms ascending chirp                 |
| `correct`        | `pickupCoin`     | 100 ms two-note chime                 |
| `incorrect`      | `hitHurt`        | 90 ms soft descending tone            |
| `levelUp`        | `powerUp`        | 420 ms rising arpeggio                |
| `lessonComplete` | `powerUp`        | 740 ms triumphant arpeggio            |
| `achievement`    | `powerUp`        | 1.15 s celebratory flourish           |
| `xpTick`         | `blipSelect`     | 9 ms ultra-short high pip             |
| `streak`         | `pickupCoin`     | 110 ms rising pluck                   |

Total shipped payload: ~40 KB MP3 + ~55 KB OGG (uncompressed);
~25 KB gzipped over the wire.

---

Made with ❤️ — keep shipping.
