# Week 0 kit

Kickoff session for the AI/ML/Optimization track (120 minutes, separate from the 16 teaching weeks). Papers appear only as short motivation (the paper wall and the KMA, Improved KMA, KomoTrip story). Most of the session builds intuition for AI, ML and optimisation, sets expectations for the 16 weeks, and ends with the Flappy Komodo game: humans play, evolution learns to play, then students tune the evolution.

| Min | Block |
|---|---|
| 0-8 | Papers as motivation |
| 8-35 | Intuition: AI/ML/optimisation, rules versus learning, the ojek line vote and loss, two ways to search, Evolusi Gambar demo, four key words |
| 35-55 | Expectations: outcomes, 16-week map, rhythm, books, grading, final project, AI tools, expectations both ways |
| 55-60 | Break |
| 60-70 | Setup stations |
| 70-115 | Flappy Komodo: Act 1 (humans), Act 2 (evolution on the projector), Act 3 (students breed), debrief |
| 115-120 | Winners and Week 1 preview |

| Folder | For | What |
|---|---|---|
| `slides/` | Mentors (projector) | The kickoff deck on the lab's PowerPoint template (28 slides, speaker notes with timings) and a PDF backup |
| `site/` | Students (deployed) | Participant handout, the "Evolusi Gambar" demo, and `game/` (Flappy Komodo: `play.html`, `breed.html`, and `stage.html` for the projector) |
| `notebooks/` | Students (Colab) | Supplementary Python material for Go programmers (to be reworked later) |
| `fasilitator/` | Mentors only | Older run sheet and answer keys. The pretest, detective cards and the paper-first run sheet belong to the previous version of this session and are no longer used |

## Flappy Komodo notes for mentors

- Everything runs in the browser. Nothing is sent anywhere, so leaderboards live on the projector laptop (`stage.html`, kept in that browser's local storage).
- Act 1 scores are honour-based: students show their phone.
- Act 3 is a race: everyone gets the same budget of 600 komodos, the course opening shrinks by 1 px per pipe (150 down to 90), and the score is how many pipes the best komodo passes. Students set the knobs with sliders (population 5 to 200 in steps of 5, mutation 1 to 50%, 1 to 16 hidden neurons). Codes look like `20-10-6-77` (population, mutation %, hidden neurons, seed). The stage re-runs each code, so results are verified, not trusted. "Check" re-runs the same knobs on five more seeds and shows the average and the worst.
- Proposed Act 3 winner rule: the top 5 by single run qualify, and the highest 5-seed average wins.
- The rehearsed Act 2 run is `50-10-6-43`: generation 1 passes 0 pipes, the finish (50 pipes) comes in generation 15 after 750 komodos.

Deploy steps are in `../docs/deploy-netlify.md`. Nothing is deployed without the coordinator's confirmation.
