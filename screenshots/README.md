# Screenshots — Practice #12 (code-based vs low-code)

Room: Engineering Lab A (Block C), unless stated. Current time = 08:00.

## Code-based (Bolt.new, React/TypeScript)

| File | What it shows | Result |
|---|---|---|
| `00-baseline-vitest-65-passed.png` | Baseline test run: 4 files, 65/65 tests passed | Pass |
| `01-app-baseline-T8-before.png` | App before testing: Existing bookings (2) | T8 "before" |
| `T1-available.png` | 10:30–11:30 → Available | Pass |
| `T2-overlap.png` | 09:30–10:30 → overlaps 09:00–10:00 (Circuits Workshop) | Pass |
| `T3-blocked-room.png` | Design Studio (blocked), 10:30–11:30 → room blocked | Pass |
| `T4-duration-zero.png` | 11:00–11:00 → start must be earlier than end | Pass |
| `T5-duration-121.png` | 10:00–12:01 → longer than 120 minutes | Pass |
| `T6-past-start.png` | 07:00–07:30 → start must be after current time | Pass |
| `T7-adjacent-available.png` | 10:00–11:00 (touches 09:00–10:00) → Available | Pass |
| `T8-bookings-after.png` | After T1–T7: same 2 bookings | Pass |
| `mobile-narrow-view.png` | Layout on a narrow (mobile) screen | — |
| `security-no-dangerouslySetInnerHTML.png` | Project search: no raw HTML rendering | Pass |
| `security-no-apiKey.png` | Project search: no API keys in code | Pass |

## Low-code (Microsoft Power Apps, canvas app)

| File | What it shows | Result |
|---|---|---|
| `T1-available.png` | 10:30, 60 min → Available (code: ok) | Pass |
| `T2-overlap.png` | 09:30, 60 min → overlaps_booking | Pass |
| `T3-blocked-toggle.png` | 10:30, 60 min, Room blocked ON → room_blocked | Pass |
| `T4-duration-zero.png` | 11:00, 0 min → invalid_interval | Pass |
| `T5-duration-121.png` | 10:00, 121 min → duration_too_long | Pass |
| `T6-past-start.png` | 07:00, 30 min → start_not_after_now | Pass |
| `T7-adjacent-available.png` | 10:00, 60 min → Available (code: ok) | Pass |
| T8 | "Existing bookings (2)" stays the same on every test screenshot above | Pass |
| `defect-D1-25h-accepted-before-fix.png` | Defect D1: start "25:00" was accepted as Available | Found |
| `defect-D1-fix-formula.png` | Fix: stricter pattern `([01]\d\|2[0-3]):[0-5]\d` | Fixed |
| `defect-D1-25h-rejected-after-fix.png` | Retest: "25:00" → invalid_input | Pass |
| `security-xss-input-rejected.png` | `<script>alert(1)</script>` in Start time → invalid_input, not executed | Pass |
| `publish-successful.png` | App published | — |
| `shared-with-instructor.png` | App shared only with the instructor (KBTU account) | — |
| `studio-editor-view.png` | Power Apps Studio: editor view of the low-code app | — |

> Note: the low-code test screenshots T1–T7 were taken before the field captions were moved above their inputs (captions appear under each field). The tested values are the same as in the test table.
