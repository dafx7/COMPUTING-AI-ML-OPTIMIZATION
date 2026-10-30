# Week 0 facilitator guide: "Belajar AI lewat paper" (2 hours)

Mentor-facing (English, with Indonesian lines to say aloud). Projector deck: `../slides/`. Student pages: `../site/` (handout and demo). Worksheets: `../notebooks/`. Everything in `fasilitator/` stays out of the deployed folder.

## 1. Idea of the session

In AI, knowledge lives in papers. Books teach the foundations, papers show where the field is today. Week 0 therefore teaches students what papers look like, how to read one in 10 minutes, and why this course (which ends with a mini paper and a poster session) is built the way it is. Four kinds of papers, each with real examples from our own campus:

| Kind | Example in the deck |
|---|---|
| Riset murni (pure research) | Reference-vector competitor pairing (Siregar and Suyanto) |
| Riset terapan (applied) | Skin-tone bias in dermatology AI; diabetic foot ulcer segmentation; fairness in recommender systems; CoT plus PoT on 4-bit small language models |
| Bidang yang berkembang (a field that keeps improving) | KMA (2021) then Improved Adaptive KMA (2022) then KomoTrip (2025) |
| Dari paper ke poster | Gradient-Free Token Eviction, paper and TENCON 2026 poster |

By the end each student has: seen the four kinds, read one abstract with five questions, heard how the course and the final project (mini paper plus poster Demo Day) work, and started their setup (Colab, GitHub, books).

**What moved out of the session.** The Python worksheet is now pre-work (homework before Week 1) and the "Optimizer 20 baris" game opens Week 1. Both notebooks are unchanged. The earlier plan put them in Week 0.

## 2. The slides

| File | Use |
|---|---|
| `../slides/Pertemuan-0-Kickoff.pptx` | The deck: your lab's PowerPoint template, 28 slides, speaker notes with timings and talking points on every slide |
| `../slides/Pertemuan-0-Kickoff.pdf` | Backup if PowerPoint or the projector laptop misbehaves |

**Fonts.** The template uses Playpen Sans. It is embedded in the .pptx, which PowerPoint normally honors. Keynote, Google Slides and LibreOffice ignore embedded fonts and will substitute another font, which can change how text wraps. Install Playpen Sans (SIL Open Font License, on Google Fonts) on the presenting laptop, or present the PDF.

**Slide map.**

| Slides | Content | Clock |
|---|---|---|
| 1 to 2 | Title, pretest | 0:00 |
| 3 to 4 | Paper wall, agenda | 0:08 |
| 5 to 14 | Four kinds of papers (5 overview, 6 pure, 7 and 8 applied, 9 to 12 the KMA line, 13 and 14 paper to poster) | 0:13 |
| 15 to 16 | Annotated abstract, how to read a paper | 0:43 |
| 17 | Detektif Paper | 0:53 |
| 18 | Break | 1:18 |
| 19 to 20 | ML dan Optimasi, demo | 1:23 |
| 21 to 25 | Weekly rhythm, books and papers, grading, final project, AI tools | 1:31 |
| 26 | Setup stations | 1:46 |
| 27 to 28 | For Meeting 1 and exit slip, thanks | 1:56 |

## 3. Before the session

| When | Task | Owner |
|---|---|---|
| T-7 days | Merge `claude/busy-cori-gjf7me` into `main` so the Colab links in the handout resolve | Daffa |
| T-7 days | Confirm the items in section 13 | Daffa |
| T-5 days | Deploy `week0/site` (see `../../docs/deploy-netlify.md`), open it on a phone, send the URL to students with the pre-work | Daffa |
| T-3 days | Print the pretest (2 pages A4, one per student plus 5 spare) | any mentor |
| T-3 days | Print the detective cards: `kartu-detektif.pdf`, 5 pages (A to E), **3 copies of each** for 15 pairs. Check the photo on card E is readable on your printer | any mentor |
| T-1 day | Open the .pptx on the presenting laptop, step through all 28 slides, check the fonts. Read the speaker notes once | mentor 1 |
| T-1 day | Check the worksheet notebooks open in Colab (homework links) | mentor 2 |
| T-1 hour | Projector test, deck on slide 1, roster sheet, mobile hotspot charged, demo (`demo.html`) open in a second window | all |

Materials: projector, printed pretest, printed cards, pens, printed roster (name, GitHub username, notes), a spare charger strip, one phone hotspot.

## 4. Roles (3 mentors, about 30 students)

| Mentor | Leads | Floor duty |
|---|---|---|
| 1 | Pretest, hook, the four kinds of papers (slides 1 to 14) | Station C (books) |
| 2 | How to read, the Detektif Paper activity, floor | Station A (Google and Colab) |
| 3 | Bridge to the course and mechanics (slides 19 to 25) | Station B (GitHub) |

Presenters can be swapped freely; the speaker notes carry the content.

## 5. Run sheet (120 minutes)

| Time | Block | What happens | Notes and pitfalls |
|---|---|---|---|
| 0:00 | Pretest (8) | Slides 1 to 2. Hand out, no devices, anonymous code name, collect face-down | "Tanpa nilai. Kosongkan yang tidak tahu." Latecomers join |
| 0:08 | Hook and agenda (5) | Slide 3 (paper wall), slide 4 | Do not read titles; they return one by one |
| 0:13 | Four kinds of papers (30) | Slides 5 to 14, about 3 minutes each | Keep to the clock: the KMA line (slides 9 to 12) is 10 minutes in total |
| 0:43 | How to read (10) | Slides 15 and 16 | The colours on slide 15 are drawn over the screenshot and match the text lines |
| 0:53 | Detektif Paper (25) | Slide 17. 3 min explain, 12 min pairs fill a card, 10 min share-out | See section 7 |
| 1:18 | Break (5) | Slide 18 | Collect the cards if you want to read them later |
| 1:23 | From papers to the course (8) | Slides 19 and 20: three words, live demo | Slide 14 (poster versus course) is the bridge, mention it again |
| 1:31 | How the class works (15) | Slides 21 to 25, about 3 minutes each | Slow down on slide 25 (AI tools). Read slide 23 attendance as a proposal unless confirmed |
| 1:46 | Setup stations (10) | Slide 26 | Colab first, GitHub second, books third |
| 1:56 | Exit slip and close (4) | Slides 27 and 28. One question and one worry on paper | Collect. Read them the same evening |

## 6. Detektif Paper: cards, share-out and answer keys

**Setup.** 15 pairs, 5 papers, 3 pairs per paper. Hand each pair one card (A to E). Pairs answer the five questions in 12 minutes (the card says where to find the number). Share-out: one pair per paper reports for about 2 minutes (problem, key number, limitation); the other two pairs of the same paper add or correct. Ask "Di kalimat mana angka itu tertulis?" to keep everyone honest.

**Answer keys** (from the abstracts and the poster photo; use as a guide, accept good variations).

**A. Skin-tone bias in dermatology AI** (riset terapan; Siregar, Lhaksmana, Yusuf; IEEE conference 2026)
1. CNNs for skin cancer can hide performance gaps across skin tones; HAM10000 is overwhelmingly light skin.
2. They audit an EfficientNet-B0 classifier for skin-tone bias and test two fixes: random oversampling and skin-tone sample weighting.
3. Leakage-free pipeline, three random seeds, Equal Opportunity Difference between light and dark groups, 95% bootstrap confidence intervals, plus a Grad-CAM border analysis.
4. EOD about 0.11 with a 95% interval that spans zero; about 182 dark-skin images (roughly 1.8%); about 10 dark-skin malignant cases in the test set; interval width near 0.65.
5. Fairness cannot be measured reliably from this dataset; naive data-level fixes are not a substitute for diverse, expert-labeled data. Duplicating 152 images adds no new information.

**B. CoT plus PoT on 4-bit small language models** (riset terapan; Hafiz et al.; IEEE conference 2026)
1. Financial question answering needs multi-hop numerical reasoning; it is unclear whether Chain-of-Thought before Program-of-Thought helps when models are aggressively quantized to 4 bits.
2. A controlled ablation: Pure PoT versus single-pass CoT+PoT on five 4-bit small language models (3.8B to 8B), identical QLoRA adapter settings.
3. The FinQA benchmark, five models, identical fine-tuning for a fair comparison.
4. Llama-3-8B 67.48 to 67.83; Qwen2.5-Coder-7B 65.74 to 66.52; Mistral-7B 63.12 to 61.29; complete execution collapse in Phi-3.8B and DeepSeek-Math-7B.
5. CoT is not universally beneficial; it helps logical reasoning in stronger models but makes Python generation more brittle. Effect depends on the backbone.

**C. Komodo Mlipir Algorithm** (the original; Suyanto, A. A. Ariyanto, A. F. Ariyanto; Applied Soft Computing, vol. 114, 2022; Telkom University)
1. Need a better metaheuristic optimizer.
2. KMA, inspired by Komodo dragons in East Nusa Tenggara and the Javanese walk "mlipir": a population split into big males (high exploitation), a female (mating or parthenogenesis) and small males (mlipir, following the big males in some dimensions), with self-adaptation of the population.
3. Twenty-three benchmark functions against recent metaheuristics, plus thousand-dimensional functions for scalability.
4. The abstract gives no single headline number: it says KMA outperforms recent metaheuristics on 23 functions and scales to thousands of dimensions. Good discussion: what number would you want to see?
5. None stated in the abstract. Good discussion: where would you look for them (results and conclusion sections)?

**D. Improved Adaptive KMA** (the improvement; Liu and Zhang, Jilin University; IEEE Access, vol. 10, 2022)
1. Improve the global search performance of KMA.
2. Two variants: IKMA-1 adaptively controls the parthenogenesis radius of the females; IKMA-2 adds adaptive weighting factors to the mlipir movement.
3. 23 CEC2013 benchmark functions against seven other algorithms, with Wilcoxon rank-sum and Friedman tests; two constrained engineering problems.
4. IKMA-1 improves on KMA by 17.58%, IKMA-2 by 10.99% (benchmark functions); IKMA-2 outperforms IKMA-1 on the engineering problems.
5. Not stated in the abstract. The numbers are the authors' own claims; a careful reader checks the baselines and tests.

**E. Gradient-Free Token Eviction (poster, TENCON 2026)** (poster; Siregar, Lhaksmana, Palupi, Telkom University). Read from the photo; check any detail against the poster before you rely on it.
1. Camera traps produce more video than ecologists can review, and full-token Video-LLM inference does not fit on field hardware (16 GB T4): full-token LLaVA-1.5-7B runs out of memory.
2. Choosing which frames and patches to keep for a frozen Video-LLM is a binary combinatorial problem (NP-hard, by reduction from Maximum k-Coverage); they search it with two gradient-free metaheuristics, BPSO and NSGA-II.
3. iWildCam 2022 top-20 species, 10-frame bursts, LLaVA-1.5-7B in 4-bit, five seeds, paired Wilcoxon test; validated at scale on 100 clips with 10 seeds.
4. BPSO uses 19.1% of the token budget; 52% fewer tokens than uniform sampling; 4.5 GB of VRAM instead of out-of-memory; 37 Pareto-optimal solutions from NSGA-II.
5. Limitations box: weak surrogate-oracle correlation (Spearman about 0.29), a shared spatial mask, and an EXIF-derived day/night proxy.

**Type check** (the bonus line on each card): A and B are riset terapan, C is riset murni and the root of a lineage, D is a bidang-berkembang follow-up, E is paper to poster.

## 7. Talking points per paper type (also in the slide notes)

- **Riset murni (slide 6).** Only the title page is on screen, so teach title reading: new idea, problem class, base algorithm. Typically judged on standard benchmark problems. The affiliation lines include our own Computing Laboratory.
- **Riset terapan (slides 7 and 8).** The skin-tone paper does not propose a new algorithm; it audits an existing model. Say: "Paper yang bagus berani bilang apa yang tidak bisa disimpulkan." This is the evaluation habit of Week 7. The CoT/PoT paper shows that mixed results get published when reported honestly.
- **The KMA line (slides 9 to 12).** KMA (online 17 Nov 2021, volume 114 in 2022), IKMA (IEEE Access 2022), KomoTrip (PeerJ Computer Science, 12 Nov 2025). KomoTrip is a discrete KMA for multi-day itineraries; a route is a permutation, so the algorithm had to be made discrete (Week 11). The abstract's other details (team orienteering with time windows, Multi-Attribute Utility Theory) come from the journal page, not from the screenshot, and I did not read the full text; stay with the title when speaking.
- **Paper to poster (slides 13 and 14).** A poster compresses a paper into seven boxes. Slide 14 maps poster elements to course weeks. NSGA-II is not in the 16-week plan (optional, Luke chapter 7); say so.

## 8. Scripts (say it in your own words)

**Hook (slide 3).** "Model yang kamu pakai tiap hari, deteksi kanker kulit, rekomendasi, chatbot, semuanya bermula sebagai paper seperti ini. Beberapa ditulis di kampus kita, bahkan di lab kita."

**Reading (slide 16).** "Kamu tidak membaca paper dari kata pertama sampai terakhir. Kamu menginterogasinya."

**AI policy (slide 25).** "Pakai AI sesukamu. Tidak ada yang mencatat. AI sangat membantu merangkum paper, tapi ia bisa salah mengutip angka, jadi angkanya kamu cek ke paper."

**Attendance (slide 23).** The 13 of 16 threshold is a proposal. If it is not confirmed, say "ambang kehadiran akan diumumkan minggu depan" and edit the slide and handout section 8.

## 9. Pre-work and Week 1 opener (the two notebooks)

**Worksheet 1, "Python untuk programmer Go"** (homework before Week 1). Answer key: `kunci/kunci_01_python_untuk_programmer_go.ipynb` (all 10 checks pass in a real kernel). Common mistakes:

| Exercise | Common mistake | Say |
|---|---|---|
| 1 | Using `/` for the integer quotient and getting 4.25 | "`//` untuk bagi bulat" |
| 2 | `range(1, n)` gives 285, not 385 | "Batas atas tidak ikut" |
| 3 | `data = data.append(7)` sets data to `None` | "`append` mengubah list di tempat" |
| 4 | Iterating a dict without `.items()` | Show what `for k in stok` yields |
| 5 | Returning a list, so `== (1, 9)` is False | "Tuple dan list berbeda" |
| 6 | Bare `except:` or forgetting `return None` | Mention `ValueError` |
| 7 to 10 | Forgetting `import numpy as np` (in the helper cell) | Run cells in order |

Two unfilled cells (exercises 2 and 4) raise `TypeError: 'ellipsis' object is not iterable` until filled. That is expected. Offer a 15-minute Python clinic at the start of Week 1 if the pretest says it is needed (section 12).

**Worksheet 2, "Optimizer 20 baris"** (Week 1 opener, 35 minutes in pairs). Key: `kunci/kunci_02_optimizer_20_baris.ipynb`. Simulated over 300 pair codes with the exact `KotakHitam` class:

| Strategy | Median % of optimum | Q1 | Q3 | Below 50% | 90% or more |
|---|---|---|---|---|---|
| Pure random, 30 points | 68.5 | 57.0 | 83.8 | 14% | 18% |
| Explore 15, then refine 15 around the best | 84.6 | 65.7 | 98.2 | 7% | 47% |
| One random start, then refine for 29 | 65.7 | 33.0 | 92.0 | 32% | 25% |

Debrief points: using past evaluations pays; refining from one start is a gamble (exploration versus exploitation); one run is an anecdote (the TENCON poster reports 5 seeds with a Wilcoxon test for exactly this reason); budget changes strategy. Honor system applies; each pair's map is different (`KODE_PASANGAN`).

## 10. Setup stations (10 minutes)

| Station | Check | Fixes |
|---|---|---|
| A. Google and Colab | Signs in, Colab opens, `print("halo")` runs, notebook 1 opens from the handout link, they can save a copy to Drive (menu label may differ; verify on the day) | No Google account: create one. Campus Wi-Fi blocking: mobile hotspot |
| B. GitHub | Username on the roster. Email verified. Two-step sign-in suggested, not forced | Verification email delayed: they finish at home |
| C. Books | UDL PDF open; printed page 17 is PDF page 31 (offset +14). Luke title page says "Online Version 2.4" (offset +2: printed 25 is PDF 27) | Old Luke version (for example 0.5, 2009) has different page numbers: re-download from the author's page |

Ten minutes is short. Colab first; anything unfinished is homework (the handout lists it). Students without a laptop: pair them and note names for a loan plan.

## 11. Contingencies

| Problem | Response |
|---|---|
| Projector or PowerPoint fails | Present the PDF. If the projector is down, pass the printed detective cards around and talk through the four kinds of papers from the handout |
| Running late | Cut slide 8 (more applied examples) and slide 14 (poster versus course) to one sentence each. Shorten the share-out to three papers. Never cut the Colab check at the stations |
| Detective cards fail to print | Show the five abstracts on the projector (slide 17 thumbnails are too small; use the PDF pages) and let pairs write answers on paper |
| Pretest runs over | Collect at 0:10 at the latest. Blank last items are data too |
| Students find papers intimidating | Remind them: read the abstract only. The colours on slide 15 are the whole method |

## 12. Pretest

Printable `pretest.html`, 12 short items, anonymous, 8 minutes (tight by design).

**Key.** Q1: 20. Q2: 9. Q3: 24. Q4: about 4 times. Q5: 6. Q6: x = 2 and the minimum 1. Q7: 32. Q8: 1/4. Q9: open (1 point if the idea is learning patterns from examples, with an example). Q10: no evidence the model works on new data. Q11: 95% accuracy and not useful. Q12: it may overshoot the minimum.

**Decision rules (my heuristics).**

| Result | Action |
|---|---|
| Fewer than 60% trace Q1 to Q3 | 15-minute Python clinic at the start of Week 1 |
| Fewer than 50% get Q5 and Q6 | One-page derivative primer before Week 2 |
| Fewer than 50% get Q7 | Vector and matrix basics in the Week 4 reading guide |
| Q10 and Q11 mostly wrong | Expected. Baseline for Week 7 |
| More than 30% miss Q12 | Richer reading guides (glossary, shorter page lists). Q12 is the English-reading check, and this week is paper-heavy |

Reuse the items in Week 16 as a post-test (students keep their code names).

## 13. Confirm before publishing

| Item | Where | Note |
|---|---|---|
| Attendance threshold | Deck slide 23, handout section 8 | "13 dari 16" is my proposal |
| Paper per week | Deck slide 22 (right column), slide 21 | The four anchor papers (Week 7 skin-tone, Weeks 9 to 11 KMA, Week 12 token eviction, Week 14 CoT/PoT) are my proposal. Remove the right column of slide 22 if undecided |
| The lung-disease paper | Missing | You mentioned a contrastive lung-disease or cancer paper; it is not in `FOTO_paper`. Add the screenshot and I will add it to slide 8 and the paper table |
| Public repo | `week0/slides`, `week0/fasilitator/kartu` | The deck and cards contain screenshots of IEEE Xplore, ScienceDirect and PeerJ pages (and a poster photo with a contact email). That is ordinary classroom use, but the repo is public. If you are unsure, make the repo private or keep the images out of it. The KMA paper is open access (CC BY-NC-ND, stated on the page); I did not check the licenses of the others |
| Date, room, channel | Not in the kit | Add to your announcement |
| Math background | Handout FAQ | "Turunan, vektor dan matriks, serta sedikit probabilitas" |
| Books and licenses | Deck slide 22, handout section 9 | UDL v5.0.3 CC BY-NC-ND 4.0; Luke 2.4 CC BY-ND 3.0 US |
| Repo PDFs | `main` | Delete the superseded 2009 `Essentials.pdf`; consider linking instead of hosting copies |
| Presenter laptop | Fonts | Playpen Sans installed, or present the PDF |

## 14. After the session

1. Read the exit slips the same evening and answer recurring questions in the Week 1 warm-up.
2. Tally the pretest and apply section 12.
3. Skim the detective cards: which questions did students leave blank most often? That tells you what to teach in Week 1.
4. Update the roster with GitHub usernames for later team formation.
5. Share the Week 1 reading guide (UDL section 1.1, pages 1 to 6, and chapter 2, pages 17 to 22).

## 15. What was tested, and what was not

**Tested** (this environment):
- **The deck:** built on your template (frames, art, embedded font), 28 slides, passes the PPTX validator against the template, rendered through LibreOffice with Playpen Sans installed, every slide inspected for overflow and overlap. Body text 24 to 38 pt on the template's 20 inch canvas, on navy panels (white on navy 15.5:1, gold on navy 8.3:1). The colour bands on slide 15 were checked against the text lines at full size and corrected.
- **Facts on the slides:** read from your screenshots; the venues and years of IKMA (IEEE Access 2022, vol. 10) and KomoTrip (PeerJ Computer Science, 12 Nov 2025) and the KMA volume (114, 2022) come from web search results, not from the screenshots.
- The detective cards print on five A4 pages; the pretest on two.
- Both worksheet notebooks run top to bottom in a real Jupyter kernel with 10 of 10 checks (worksheet 1).
- The static site (handout and demo) with the same headers as `_headers`: no console errors, no external requests, no horizontal overflow at 375 px and 1280 px.

**Not tested:**
- The deck in PowerPoint, Keynote or Google Slides (only LibreOffice here), and on a real projector.
- Google Colab itself.
- Any Netlify deploy. I did not log in or deploy.
- The Colab links, which resolve only after the files are on `main`.
- Real classroom timing, and whether pairs finish a card in 12 minutes.
- The poster photo reading (card E and its key): small text read from a phone photo.

## 16. File map

```
week0/
  netlify.toml                      build config for the GitHub deploy
  slides/                           the projector deck (pptx) and PDF backup
  site/                             the deployable static site (handout, demo)
  notebooks/                        student worksheets (open in Colab)
  fasilitator/                      mentor-only, not deployed
    panduan-fasilitator.md          this file
    pretest.html                    printable pretest
    kartu-detektif.html / .pdf      printable detective cards A to E (images in kartu/)
    kunci/                          answer-key notebooks
```
