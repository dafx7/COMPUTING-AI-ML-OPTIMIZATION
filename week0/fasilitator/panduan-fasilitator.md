# Week 0 facilitator guide: kickoff session (2 hours)

Mentor-facing (English, with Indonesian lines to say aloud). Student-facing material: `../slides/` (the projector deck), `../site/` (handout, web copy of the slides, demo) and `../notebooks/` (two Colab worksheets). Everything in `fasilitator/` stays out of the deployed folder.

## 1. Purpose and outcomes

A separate 120-minute session before Week 1. By the end, each student has:
1. heard how the course, grading, final project and AI policy work,
2. met Python through the Go they already know,
3. solved one small optimization problem with a budget (their first optimizer),
4. a working Colab, a GitHub account and both books on their device,
5. (optional) taken an anonymous pretest that tells the mentors where to put clinics.

Compared with the earlier 150-minute plan: the pretest is 8 minutes and runs first, the mid-session break is gone (one 5-minute break at 1:05), the worksheet covers exercises 1 to 6 (NumPy exercises 7 to 10 are homework), and the setup stations take 10 minutes.

## 2. The slides

| File | Use |
|---|---|
| `../slides/Pertemuan-0-Kickoff.pptx` | The deck to present: your lab's PowerPoint template, 19 slides, speaker notes with timings on every slide |
| `../slides/Pertemuan-0-Kickoff.pdf` | Backup if PowerPoint or the projector laptop misbehaves |
| `../site/slide.html` | Web copy of the content for phones. Different slide order, same agenda |

**Fonts.** The template uses Playpen Sans. The font is embedded in the .pptx, which PowerPoint normally honors. Keynote, Google Slides and LibreOffice ignore embedded fonts and will substitute another font, which can change how text wraps. Install Playpen Sans (SIL Open Font License, on Google Fonts) on the presenting laptop, or present from the PDF.

**Slide map (matches the notes in the deck).**

| Slide | Content | Time |
|---|---|---|
| 1 | Title, on screen while people arrive | before 0:00 |
| 2 | Pretest | 0:00 |
| 3 | Agenda | 0:08 |
| 4 | ML dan Optimasi (objective, search space, budget) | 0:09 |
| 5 | Demo: Evolusi Gambar | 0:11 |
| 6 to 11 | After 16 weeks, weekly rhythm, books, grading, final project, AI policy | 0:15 |
| 12 | Python untuk programmer Go | 0:30 |
| 13 | Worksheet 1 | 0:40 |
| 14 | Break | 1:05 |
| 15 | Optimizer 20 baris | 1:10 |
| 16 | Discussion | 1:40 |
| 17 | Setup stations | 1:45 |
| 18 | For Meeting 1, exit slip | 1:55 |
| 19 | Thank you | 2:00 |

## 3. Before the session

| When | Task | Owner |
|---|---|---|
| T-7 days | Merge `claude/busy-cori-gjf7me` into `main` so the Colab links in the handout resolve (they point at `main`) | Daffa |
| T-7 days | Confirm the items in section 12 | Daffa |
| T-5 days | Deploy `week0/site` (see `../../docs/deploy-netlify.md`), open it on a phone, send the URL to students with the pre-work | Daffa |
| T-3 days | Print the pretest (2 pages A4, `pretest.html`, one per student plus 5 spare) | any mentor |
| T-3 days | Assign pair codes 1 to 15 on a sheet | mentor 3 |
| T-1 day | Open both Colab notebooks from the deployed handout on a laptop that is not yours, run them top to bottom with the answer key pasted in | mentor 2 |
| T-1 day | Open the .pptx on the presenting laptop, step through all 19 slides, check the fonts | mentor 1 |
| T-1 hour | Projector test, deck on slide 1, whiteboard divided for the leaderboard, roster sheet, mobile hotspot charged, demo (`demo.html`) opened in a second window | all |

Materials: projector, whiteboard and markers, printed pretest, pens, printed roster (name, GitHub username, notes), a spare charger strip, one phone hotspot.

## 4. Roles (3 mentors, about 30 students)

| Mentor | Leads | Floor duty |
|---|---|---|
| 1 | Pretest hand-out, welcome and mechanics (0:00 to 0:30), Python mini-lecture (0:30 to 0:40) | Station C (books) |
| 2 | Worksheet floor (0:40 to 1:05) | Station A (Google and Colab) |
| 3 | Optimizer (1:10 to 1:45), leaderboard | Station B (GitHub) |

## 5. Run sheet (120 minutes)

| Time | Block | What happens | Notes and pitfalls |
|---|---|---|---|
| 0:00 | Pretest (8) | Slide 2. Hand out, no devices, anonymous code name, collect face-down | Say: "Tanpa nilai. Kosongkan yang tidak tahu." Latecomers join the pretest |
| 0:08 | Welcome and demo (7) | Slides 3 to 5. Open the demo, speed Cepat, press Mulai before you talk | Say the pitch (section 6). Do not explain hill climbing yet |
| 0:15 | How the course works (15) | Slides 6 to 11, about 2.5 minutes each | Slow down on slide 11 (AI policy). Read slide 9 attendance as a proposal unless confirmed |
| 0:30 | Python for Go (10) | Slide 12, then live-code the three snippets in section 7 | Real Go in the left pane. Keep to 10 minutes |
| 0:40 | Worksheet (25) | Slide 13. Pairs open notebook 1 from the handout. Exercises 1 to 6 | Mentor 2 circulates. Stuck after 3 minutes: neighbour, then a mentor |
| 1:05 | Break (5) | Slide 14 | Write the leaderboard columns: pair, Round 1 %, Round 2 %. Hand out pair codes |
| 1:10 | Optimizer (35) | Slide 15, notebook 2 (section 9) | Strict timeboxes |
| 1:45 | Setup stations (10) | Slide 17 | A, B, C, with the checks in section 10. Colab first |
| 1:55 | Exit slip and close (5) | Slides 18 and 19. One question and one worry on paper | Collect. Read them the same evening |

## 6. Scripts (say it in your own words)

**Pitch (0:08).** "Di kelas ini kita memperlakukan hampir semua masalah ML sebagai masalah optimasi: ada fungsi tujuan, ruang pencarian, dan anggaran. Demo ini punya 40 segitiga dan satu aturan: ubah sedikit, simpan kalau lebih baik. Perhatikan kurvanya sambil saya bicara."

**AI policy (slide 11).** "Pakai AI sesukamu. Tidak ada yang mencatat. Tapi kuis pembuka dan cek lisan tanpa perangkat, dan ada tujuh pekan di mana kamu harus memeriksa jawaban asisten. Alasannya sederhana: AI bisa menulis kode pelatihan yang kelihatan benar tapi keliru, dan kamu perlu bisa melihat kekeliruannya."

**Attendance (slide 9).** The 13 of 16 threshold is a proposal. If it is not confirmed, say "ambang kehadiran akan diumumkan minggu depan" and edit the slide (and handout section 7) before sharing again.

## 7. Python mini-lecture: three live-code snippets

Write Go on the left, Python on the right, run the Python.

1. **Loop and collection.** `for _, v := range data { total += v }` becomes `for v in data: total += v`. Show `range(1, n + 1)` and that the upper bound is excluded.
2. **Two return values.** `return a, b`. Show that the caller receives a tuple and can unpack it: `kecil, besar = min_maks(data)`.
3. **Vectors.** `a = np.array([2, 4, 6, 8]); a * 10 + 1`. Say: "Hampir semua kode kita nanti tanpa for."

## 8. Worksheet notes (notebook 1)

Answer key: `kunci/kunci_01_python_untuk_programmer_go.ipynb` (all 10 checks pass in a real kernel). In class: Part A, exercises 1 to 6. At home: Part B (NumPy), exercises 7 to 10.

| Exercise | Common mistake | Say |
|---|---|---|
| 1 | Using `/` for the integer quotient and getting 4.25 | "`//` untuk bagi bulat" |
| 2 | `range(1, n)` gives 285, not 385 | "Batas atas tidak ikut" |
| 3 | `data = data.append(7)` sets data to `None` | "`append` mengubah list di tempat dan tidak mengembalikan apa pun" |
| 4 | Iterating a dict without `.items()` | Show what `for k in stok` yields |
| 5 | Returning a list, so `== (1, 9)` is False | "Tuple dan list berbeda" |
| 6 | Bare `except:` or forgetting `return None` | Both work in the check, mention `ValueError` |
| 7 to 10 | Forgetting `import numpy as np` (already in the helper cell) | Run cells in order |

Two unfilled cells (exercises 2 and 4, `for ... in ...:`) raise `TypeError: 'ellipsis' object is not iterable` until the student fills them. That is expected.

## 9. Optimizer worksheet (notebook 2)

Key: `kunci/kunci_02_optimizer_20_baris.ipynb` (one worked strategy, output varies by pair code).

**Timeboxes (35 min).** 1:10 explain and set `KODE_PASANGAN` (4). 1:14 Round 1 (10). 1:24 Round 2 (10). 1:34 reveal plot and leaderboard (6). 1:40 debrief (5, slide 16).

**What to expect.** I simulated the exact `KotakHitam` class over 300 pair codes (strategies written as in the key; your students will vary):

| Strategy | Median % of optimum | Q1 | Q3 | Below 50% | 90% or more |
|---|---|---|---|---|---|
| Pure random, 30 points | 68.5 | 57.0 | 83.8 | 14% | 18% |
| Explore 15, then refine 15 around the best | 84.6 | 65.7 | 98.2 | 7% | 47% |
| One random start, then refine for 29 | 65.7 | 33.0 | 92.0 | 32% | 25% |

Take-aways to draw out in the debrief:
1. **Using past evaluations pays.** Explore-then-refine beats pure random on the median.
2. **Refining from a single start is a gamble.** It wins big or gets stuck on the small hill (the lowest quartile is below 33%). This is the exploration versus exploitation trade-off, met formally in Week 9 (hill climbing, SA).
3. **One run is an anecdote.** Two pairs with the same strategy can differ by 30 points. This is why the final project needs 10 or more runs.
4. **Budget changes strategy.** If an evaluation costs one hour (training a model), nobody picks pure random.

**Honor system.** `KotakHitam` is readable and a student can cheat. Say so: "Kalau kamu mengubah penghitungnya, kamu hanya menipu dirimu sendiri." The point is the experience.

**Different map per pair.** `KODE_PASANGAN` seeds the map, so coordinates cannot be copied between pairs. The leaderboard compares percentages.

**If students use an AI assistant** to write Round 2, ask: "Berapa evaluasi yang dipakai? Strateginya apa dalam satu kalimat?"

## 10. Setup stations (10 minutes)

| Station | Check | Fixes |
|---|---|---|
| A. Google and Colab | Signs in, Colab opens, `print("halo")` runs, notebook 1 opens from the handout link, they can save a copy to their Drive (menu label may differ; verify on the day) | No Google account: create one now. Campus Wi-Fi blocking: use the mobile hotspot |
| B. GitHub | Username written on the roster. Email verified. Two-step sign-in suggested, not forced | Verification email delayed: continue, they finish at home |
| C. Books | UDL PDF open; printed page 17 is PDF page 31 (offset +14). Luke title page says "Online Version 2.4" (offset +2: printed 25 is PDF 27) | Old Luke version (for example 0.5, 2009) has different page numbers: re-download from the author's page |

Ten minutes is short. Colab first, GitHub second, books third; anything unfinished is homework (the handout lists it).

Students without a laptop: pair them for the whole session, and note names for a loan plan.

## 11. Contingencies

| Problem | Response |
|---|---|
| Colab unreachable | Hotspot. If that fails: run the Optimizer live. Each pair calls out a point, a mentor runs the key notebook on the projector, 30 calls in total |
| Projector or PowerPoint fails | Present the PDF. If the projector is down, open the handout on a phone and read the key slides aloud, and whiteboard the three Go versus Python snippets |
| Running late | Cut the Optimizer debrief to questions 1 and 4. Shorten the worksheet to exercises 1 to 4. Never cut the Colab check at the stations |
| Many students stuck on Python | Stop the worksheet at exercise 4 (NumPy comes back in Week 1 anyway) |
| Pretest runs over | Collect at 0:10 at the latest. Blank last items are data too |

## 12. Pretest

Printable `pretest.html`, 12 short items, anonymous, 8 minutes. It is tight by design: students who leave the last items blank tell you something too.

**Key.** Q1: 20. Q2: 9. Q3: 24. Q4: about 4 times. Q5: 6. Q6: x = 2 and the minimum 1. Q7: 32. Q8: 1/4. Q9: open (1 point if the idea is learning patterns from examples, with an example). Q10: no evidence the model works on new data (overfitting, memorization). Q11: 95% accuracy and not useful, since it never finds a sick person. Q12: it may overshoot the minimum.

**Tally per section.** A (Q1 to Q4), B (Q5 to Q8), C (Q9 to Q11), D (Q12). Count the students answering each item correctly.

**Decision rules (my heuristics, adjust to taste).**
| Result | Action |
|---|---|
| Fewer than 60% trace Q1 to Q3 | Add a 15-minute Python clinic at the start of Week 1 |
| Fewer than 50% get Q5 and Q6 | Hand out a one-page derivative primer before Week 2 |
| Fewer than 50% get Q7 | Add vector and matrix basics to the Week 4 reading guide |
| Q10 and Q11 mostly wrong | Expected. It is the baseline for Week 7 |
| More than 30% miss Q12 | Make the weekly reading guides richer (glossary, shorter page lists) |

Re-use the same items in Week 16 as a post-test. Students keep their code names, so each person can compare their own before and after.

## 13. Confirm before publishing

| Item | Where it appears | Current text |
|---|---|---|
| Attendance threshold | Deck slide 9, handout section 7, web slides | "minimal 13 dari 16 pertemuan" (my proposal) |
| Date, time, room | Not in the kit | Add to your announcement |
| Communication channel | Handout section 11 | "kanal komunikasi kelas" (unnamed) |
| Math background of the students | Handout FAQ | "Turunan, vektor dan matriks, serta sedikit probabilitas" |
| UDL and Luke edition and licenses | Deck slide 8, handout section 8 | UDL v5.0.3 CC BY-NC-ND 4.0. Luke 2.4 CC BY-ND 3.0 US. Both read from the files in the repo |
| Repo PDFs | `main` has `Essentials.pdf` (2009, superseded), `Essentials (1).pdf` (2.4) and the UDL PDF | Delete the 2009 file, and consider linking instead of hosting copies |
| Presenter laptop | Fonts | Playpen Sans installed, or present the PDF |

## 14. After the session

1. Read the exit slips the same evening and answer the questions that recur in the Week 1 warm-up.
2. Tally the pretest and apply section 12.
3. Photograph the leaderboard.
4. Update the roster, with GitHub usernames for later team formation.
5. Share the Week 1 reading guide (UDL section 1.1, pages 1 to 6, and chapter 2, pages 17 to 22).

## 15. What was tested, and what was not

**Tested** (this environment, Python 3.13, NumPy 2.5.3, matplotlib 3.11.2, a clean virtual environment):
- Both answer-key notebooks run top to bottom in a real Jupyter kernel with no errors and 10 of 10 checks passing. The unfilled student versions fail only with the expected messages.
- 300-code simulation of three strategies on the exact `KotakHitam` class (section 9).
- The static site served with the same headers as `_headers` (including a strict Content-Security-Policy), driven by headless Chromium at 375 px and 1280 px wide: no console errors, no external requests, no horizontal overflow. The demo reduces its error from 76.8 to 11.8 within 2.5 seconds on this machine, then exhausts its 30,000-evaluation budget.
- Colour pairs on the web pages against the WCAG 2.x AA text threshold (4.5:1): all pass.
- The pretest prints on two A4 pages.
- **The deck:** built on your template (its frames, art and embedded font), 19 slides, passes the PPTX validator against the template, rendered through LibreOffice with Playpen Sans installed and every slide inspected for overflow and overlap. Body text is 28 to 38 pt on the template's 20 inch wide canvas, on navy panels (white on navy 15.5:1, gold on navy 8.3:1).

**Not tested:**
- Google Colab itself. The notebooks use only basic NumPy and matplotlib calls, but Colab's runtime versions differ from mine.
- The deck in PowerPoint, Keynote or Google Slides (only LibreOffice here), and on a real projector.
- Safari, Firefox, and older Android browsers for the web pages.
- Any Netlify deploy. I did not log in or deploy.
- The Colab links, which resolve only after the files are on `main`.
- Real classroom timing and the difficulty of the pretest items.
- Screen readers beyond the built-in landmarks and live regions.

## 16. File map

```
week0/
  netlify.toml                      build config for the GitHub deploy
  slides/                           the projector deck (pptx) and PDF backup
  site/                             the deployable static site
    index.html  slide.html  demo.html  favicon.svg  _headers
    css/ js/
  notebooks/                        student worksheets (open in Colab)
  fasilitator/                      mentor-only, not deployed
    panduan-fasilitator.md          this file
    pretest.html                    printable pretest
    kunci/                          answer-key notebooks
```
