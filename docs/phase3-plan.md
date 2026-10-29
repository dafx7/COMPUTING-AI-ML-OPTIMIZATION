# Phase 3 proposal: AI/ML/Optimization track, 16 weeks

Status: proposal, waiting for approval. Mentor-facing (English). Student-facing material will be in Bahasa Indonesia in Phase 4.

Locked decisions from earlier phases: Option A (UDL + Luke), 16 teaching weeks plus a separate Week 0, 2-hour sessions, about 30 students, 3 mentors, teams of 3 (2 for odd counts), AI tools unrestricted with no logs, final project = ML model plus a load-bearing metaheuristic compared against a baseline.

## 0. Conventions used in every week

**Sources and page references.**
- UDL = *Understanding Deep Learning* (Prince), PDF release v5.0.3, 9 Feb 2026, identical to the file in the repo (SHA-256 checked). Pages are PDF document pages from its contents. Notebook names are from the book site's list of 68 notebooks.
- Luke = *Essentials of Metaheuristics*, **Second Edition, Online Version 2.4, January 2026 (263 pp)**, the file `Essentials (1).pdf` in the repo. Its license page says CC BY-ND 3.0 US and, in the 2.4 summary, forbids translation as well as modification. Page numbers are document pages from its contents. The older file `Essentials.pdf` (2009, v0.5) is superseded and should be deleted from the repo.
- D2L = *Dive into Deep Learning* v1.0.3, section titles verified on d2l.ai (used only as supplement in W6 and W12).
- Clever = *Clever Algorithms* (Brownlee), used for ACO in W11.

**Session template (120 min).**

| Min | Block |
|---|---|
| 0-10 | Retrieval warm-up, closed device, 4 questions |
| 10-35 | Mini-lecture with a worked example (intuition first, then notation) |
| 35-95 | Hands-on in pairs: a from-scratch core, then an extension |
| 95-110 | W1-W7: discussion and clinic. W9-W14: team time, mentors rotate (about 5 min per team) |
| 110-120 | Exit question (written) and preview of next week |

**Retrieval warm-up recipe.** Each quiz has 4 questions: one from last week, one from 2 weeks ago, one from 4 or more weeks ago, one from the core vocabulary (loss, gradient, budget, evaluation). Ungraded, scored by the student, and a mentor reads the tally.

**Weekly time (my assumption, verify with students).** Reading 1.5 to 2 h (10 to 20 pages with an Indonesian reading guide), deliverable 1.5 to 2 h, class 2 h. From W9 the notebook shrinks to about 90 min and the project takes about 2.5 h.

**AI policy per week.** Tools are allowed everywhere. Seven weeks carry a required "verify the assistant" task, listed in each week. Warm-ups and orals are closed-device.

**Grading (accepted default).** 40% weekly deliverables (completion plus one understanding question), 10% oral checkpoints (W8 individual oral 5%, W12 team prototype Q&A 5%), 50% final project (30 team, 20 individual oral). Attendance is a gate. Checkpoint 1 moved from W6 to W8 because W6 is PyTorch-heavy and W8 closes the from-scratch arc.

## 1. Overview

| Wk | Theme | Source | Deliverable | Flag |
|---|---|---|---|---|
| 0 | Kickoff, Python bridge, first optimizer | Whirlwind Tour of Python (CC0) | Setup check, optional pretest | Separate session |
| 1 | Learning = minimizing a loss | UDL §1.1, ch2 | Notebook + exit question | Week 1 site |
| 2 | Gradient descent | UDL ch6 §6.1-6.2 | GD notebook + finite-difference check | |
| 3 | Loss for classification | UDL ch5 | Logistic regression from scratch | |
| 4 | Neural networks | UDL ch3 + ch4 | Forward pass + hand-fit puzzle | Merged chapters |
| 5 | Backpropagation | UDL ch7 | Backprop + gradient check + bug hunt | Hardest week, clinic |
| 6 | PyTorch, momentum, Adam | UDL ch6 §6.3-6.5 + D2L | NumPy vs PyTorch match | Supplement week |
| 7 | Generalization and honest evaluation | UDL ch8 + ch9 (partial) | Leakage report | Heavy |
| 8 | Checkpoint 1 | none | From-scratch trainer + oral | **Checkpoint, buffer, teams formed** |
| 9 | Single-state metaheuristics | Luke ch2, ch1, §11.1 | SA + arena table | Proposal due |
| 10 | Population metaheuristics | Luke ch3 | GA + PSO + arena table | |
| 11 | Representation, combinatorial problems | Luke ch4, §8.1-8.3 + Clever | Encodings + TSP comparison | Baseline due, supplement |
| 12 | Hybrids: optimization inside ML | Luke §3.3.4, §9.2 + D2L ch19 | Hybrid experiment | **Checkpoint 2**, supplement |
| 13 | Inductive bias and transfer learning | UDL ch10, ch11 | Transfer vs scratch | Hello-world deploy due |
| 14 | Transformers and LLMs | UDL ch12 | Attention + decoding lab | Deployed v0 due |
| 15 | Data, responsibility, deployment | UDL §1.4, nb 21.1-21.2, HF course ch9 | Data statement, model card, orals | **Buffer**, orals |
| 16 | Demo day | none | Demo, technical note, repo | Final |

## 2. Week by week

### Week 1. Learning is minimizing a loss
- **Can do:** state in their own words what model, parameter, loss and training are. Compute the MSE of a line on 4 points by hand. Find good intercept and slope by grid search and by random search and count evaluations. Explain why trying every value fails at a million parameters.
- **Source:** UDL §1.1 (pp 1-6), ch2 (pp 17-24). Notebook 2.1. Optional Notebook 1.1.
- **Hands-on:** Week 1 site (loss landscape), then a Colab that fits a line with random search in NumPy.
- **Deliverable:** notebook plus a 3-sentence exit answer: why can't we try all parameter values for a model with a million parameters?
- **Class adds:** the vocabulary used all course: objective, search space, evaluation budget.
- **AI:** allowed. Suggested: ask an assistant to explain MSE versus MAE, then confirm with a hand calculation.
- **Feeds project:** the objective/search space/budget wording used in the proposal.

### Week 2. Gradient descent
- **Can do:** derive the gradient of MSE for a line. Write a GD loop in NumPy. Predict what a too-small and too-large learning rate does. Say what SGD changes.
- **Source:** UDL ch6 §6.1-6.2 (pp 77-85). Notebooks 6.1, 6.2.
- **Hands-on:** learning-rate lab, then GD against W1's random search at equal evaluation counts.
- **Deliverable:** GD notebook with loss curves for 3 learning rates and a short interpretation.
- **Class adds:** the gradient is free direction information. Metaheuristics (W9+) assume you do not have it. Count evaluations honestly.
- **AI:** **required** verification: take the gradient formula an assistant gives and check it with a finite-difference estimate.
- **Feeds project:** baseline-first habit, loss-curve plots.

### Week 3. Loss functions and classification
- **Can do:** explain a loss as a penalty chosen for the task. Write MSE and binary cross-entropy. Train logistic regression with GD. Split data into train and test and report both. Explain why accuracy misleads on imbalanced data.
- **Source:** UDL ch5 §5.1-5.4, §5.7 (pp 56-66, 71-72). Notebooks 5.1, 5.2. Maximum likelihood is a sidebar, not an exam topic.
- **Hands-on:** logistic regression from scratch on 2D data, decision boundary plot.
- **Deliverable:** notebook plus exit question: 95% accuracy when 95% of the data is one class, good or not?
- **Class adds:** loss design is objective design. A GA fitness function is a loss with a sign flip.
- **AI:** allowed.
- **Feeds project:** metric choice.

### Week 4. Neural networks
- **Can do:** compute a 1-hidden-layer ReLU forward pass by hand. Explain a network as a piecewise-linear function. Implement an L-layer forward pass with matrices. Explain why stacked linear layers collapse.
- **Source:** UDL ch3 §3.1-3.4 (pp 25-35), ch4 §4.1-4.3 (pp 41-48). Notebooks 3.1-3.3, 4.1, 4.3.
- **Hands-on:** hand-fit puzzle: set weights by hand to match a bumpy 1D curve. Students feel why automatic training is needed.
- **Deliverable:** forward-pass notebook plus the hand-fit score.
- **Class adds:** parameter count is the dimension of the search space.
- **AI:** allowed.
- **Feeds project:** model choice vocabulary.

### Week 5. Backpropagation and initialization (hardest of the first half)
- **Can do:** apply the chain rule on a scalar 2-layer graph by hand. Implement backprop for a 2-layer MLP in NumPy and verify it with a gradient check. Train it on XOR. Explain why initialization scale matters.
- **Source:** UDL ch7 §7.1-7.5 (pp 96-110). Notebooks 7.1, 7.2, 7.3.
- **Hands-on:** a 30-line scalar autograd built live, then the matrix version.
- **Deliverable:** notebook with a passing gradient check.
- **Class adds:** a gradient check is an oracle for any objective you code. Backprop is cheap gradients, which is exactly what W9+ problems lack.
- **AI:** **required** bug hunt: a provided backprop has 2 planted bugs. Use the gradient check to locate each one. Assistants may help, the notebook must show how the check found the bug.
- **Feeds project:** testing mindset. Extra clinic this week.

### Week 6. PyTorch, momentum and Adam (supplement week)
- **Can do:** create tensors and use autograd. Rebuild W5's network in PyTorch and match the loss curve. Run SGD, momentum and Adam and explain momentum in one sentence. Write a training loop (zero_grad, forward, loss, backward, step) and spot common mistakes.
- **Source:** UDL ch6 §6.3-6.5 (pp 86-91), Notebooks 6.3-6.5. Supplement D2L §2.1, §2.5, §3.5, §5.2 (CC BY-SA 4.0, read online).
- **Hands-on:** optimizer race on the Rosenbrock function, the same function the metaheuristics use in W9-W10.
- **Deliverable:** NumPy-versus-PyTorch comparison plus a training loop with a planted bug (forgotten zero_grad).
- **Class adds:** one test function, many tools. Luke §11.2 test problems (pp 221-226) give the shared benchmark set.
- **AI:** allowed.
- **Feeds project:** PyTorch skeleton for team code.

### Week 7. Generalization and honest evaluation
- **Can do:** state what train, validation and test are for. Read train/validation curves and name under- and overfitting. Explain bias and variance in plain words. Apply weight decay and early stopping. Find data leakage in a pipeline. Report precision, recall and a confusion matrix.
- **Source:** UDL ch8 §8.1-8.3, §8.5 (pp 118-126, 132-133), ch9 §9.1-9.2 (pp 138-142). Notebooks 8.1, 8.2, 9.1, 9.2. Skip §8.4 double descent.
- **Hands-on:** "Detektif Kebocoran": three pipelines with hidden leaks (scaling before the split, duplicate rows across splits, test-set tuning).
- **Deliverable:** experiments notebook plus a leakage report.
- **Class adds:** the validation set is the fitness evaluation for tuning, and tuning against it too long overfits it. Baselines first: majority class, mean prediction, a plain scikit-learn model.
- **AI:** **required** audit: ask an assistant for a train/test pipeline for a given CSV, then audit it with the 6-point checklist.
- **Feeds project:** the evaluation protocol in every proposal.

### Week 8. Checkpoint 1 (buffer)
- **Can do:** train logistic regression and an MLP from scratch with GD, evaluate on held-out data, and explain each step aloud.
- **Hands-on:** three oral stations (about 7 min each, 10 students per mentor) while others finish the integration notebook or attend a catch-up clinic. Cumulative closed-device quiz at the start.
- **Deliverable:** the "from-scratch trainer" notebook plus the individual oral (5% of grade).
- **Class adds:** none. This is consolidation. 95-120 min: team announcement and project brief.
- **AI:** allowed for the notebook. Closed device for the oral.
- **Feeds project:** teams formed from the skills survey.

### Week 9. Single-state metaheuristics
- **Can do:** define a Tweak for a real vector, a bitstring and a permutation. Implement hill climbing and simulated annealing from pseudocode. Explain what temperature does. Run 20 seeds and report median and spread at equal budget. Say where SA beats hill climbing and where gradient descent wins.
- **Source:** Luke §1 (pp 13-16), ch2 §2.1-2.4 (pp 17-26), §2.5-2.6 optional, §11.1.1 and the first part of §11.1.2 (pp 213-216). Test functions from §11.2.2 (pp 222-226).
- **Hands-on:** "Arena": random search, hill climbing, SA and GD on Rosenbrock and Rastrigin, same evaluation budget.
- **Deliverable:** SA notebook plus the arena table (median over 20 seeds). Project proposal due.
- **Class adds:** gradient-free search is the default when the objective is a black box (simulation, accuracy, schedule violations). Budget accounting: count function evaluations.
- **AI:** **required** check: ask an assistant to translate Luke's SA pseudocode to Python, then verify it against a hand trace of 5 iterations.
- **Feeds project:** one-page proposal, experimental protocol.

### Week 10. Population metaheuristics
- **Can do:** implement a bitstring GA and a real-valued ES or GA. Explain selection pressure, the roles of crossover and mutation, and elitism. Implement PSO in about 15 lines and name its three terms. Run the arena with GA, PSO and DE against SA, random search and GD.
- **Source:** Luke ch3 §3.1-3.2 (pp 33-45), §3.3.1 (p 46), §3.4 DE (p 54), §3.5 PSO (pp 55-58). Skip §3.3.3 tree GP and §3.3.5 scatter search.
- **Hands-on:** Arena II, plus the GA/PSO side-by-side site.
- **Deliverable:** GA and PSO notebook passing provided unit tests, the arena table, and 5 sentences on when to pick which.
- **Class adds:** no overall winner (no free lunch). Evaluations = population x generations.
- **AI:** **required** bug hunt: a provided GA with a selection bug that causes premature convergence.
- **Feeds project:** algorithm family choice.

### Week 11. Representation and combinatorial problems (supplement)
- **Can do:** choose and justify an encoding for knapsack, scheduling and routing. Handle constraints by penalty, repair or a safe encoding. Implement swap and inversion mutations and order crossover on permutations. Run SA, GA and Ant System on a 20 to 40 city TSP at equal budget.
- **Source:** Luke ch4 §4.1 (pp 61-65), §8.1 (pp 148-150), §8.3 ACO (pp 152-158), Clever swarm chapter (Ant System recipe). Luke 2.4 has no section on permutation operators (searched the text). The class supplies them.
- **Hands-on:** TSP arena with a starter skeleton.
- **Deliverable:** encoding decision table for 3 problems plus the TSP comparison. **Project baseline due.**
- **Class adds:** representation shapes the landscape. Three questions for any encoding: does every string decode to a valid solution, do small changes make small effects, is the space a sensible size.
- **AI:** **required** critique: ask an assistant to propose an encoding for your project problem, then judge it with the three questions.
- **Feeds project:** encoding and baseline.

### Week 12. Hybrids: optimization inside ML (supplement, Checkpoint 2)
- **Can do:** frame hyperparameter tuning as black-box optimization (search space, objective = validation loss, budget = trials). Compare random search, GA or PSO, and successive halving at equal training runs. Do GA feature selection with a cheap model. Explain the memetic idea (GA plus local search).
- **Source:** Luke §3.3.4 hybrid optimization (pp 49-52, broadened in 2.4), §9.2 intro (pp 165-167), optional §9.2.3 (pp 173-180, parametric-distribution EDAs, CMA-ES is discussed there). D2L ch19 §19.1, §19.3, §19.4 (CC BY-SA 4.0). UDL §8.5.
- **Hands-on:** a tuning tournament on the W6 network (12-trial budget). Instructor demo (25 min): the learned-simulator planner with random shooting versus GA/SA/CEM-style search. **Untested at student scale. I should prototype it before this week.**
- **Deliverable:** one hybrid experiment with at least 10 seeds.
- **Checkpoint 2:** team prototype review (about 12 min per team, 3 to 4 teams per mentor) while others run the tournament.
- **Class adds:** this is the course's identity week: ML grounded in optimization, in both directions.
- **AI:** allowed.
- **Feeds project:** metaheuristic integrated, first comparison table.

### Week 13. Inductive bias and transfer learning
- **Can do:** compute a 1D and 2D convolution by hand. Explain weight sharing and count parameters of a conv layer versus a dense layer. Fine-tune a pretrained image model on a few hundred images. Say what a residual connection does in one sentence. Run a CLIP-style zero-shot classification.
- **Source:** UDL ch10 §10.1-10.3 (pp 161-171), ch11 §11.1-11.2 (pp 186-192). Notebooks 10.1, 10.3, 10.5, 11.2. Fleuret (Little Book) §6.6 text-image representations, read only.
- **Hands-on:** parameter-counting race (MLP versus CNN on small images), then transfer learning versus training from scratch on a small collected dataset (no faces, no personal data).
- **Deliverable:** transfer-versus-scratch comparison with learning curves. **Hello-world deploy due (public URL).**
- **Class adds:** each training run costs minutes, so the budget from W9-W12 applies. Architecture choice is also a search problem (one paragraph).
- **AI:** allowed.
- **Feeds project:** pretrained components, deployment risk found early.

### Week 14. Transformers and LLMs
- **Can do:** compute self-attention for 3 tokens by hand. Implement single-head attention in NumPy. Explain tokenization and next-token prediction. Generate text with different temperature, top-k and beam settings. Describe limits (hallucination, context, bias) and a way to verify an LLM answer.
- **Source:** UDL ch12 §12.1-12.7 (pp 207-226). Notebooks 12.1-12.4 (self-attention, multi-head, tokenization, decoding strategies).
- **Hands-on:** attention explorer and decoding lab. A 15-minute "map" slide on VLA and world models.
- **Deliverable:** attention-from-scratch plus decoding experiments, plus a one-paragraph verification protocol for an LLM answer used in their project. **Deployed v0 due.**
- **Class adds:** decoding is search over token sequences. Beam search is pruned search, temperature echoes SA's temperature.
- **AI:** **required** task: verification protocol applied to an assistant's answer about their own project.
- **Feeds project:** model integration.

### Week 15. Data, responsibility, deployment (buffer, individual orals)
- **Can do:** write a data statement (source, license, collection, known gaps). Run a subgroup performance audit. Write a short model card (use, limits, one failure case). Redeploy and test the public URL from a phone on campus Wi-Fi.
- **Source:** UDL §1.4 (pp 12-14), Notebooks 21.1 (bias mitigation), 21.2 (explainability). HF LLM course ch9 for Gradio (license and content to verify). UDL ch21 is mostly value alignment and misuse, so most of this week is original class material.
- **Hands-on:** parallel stations. Orals (7 min each, about 70 min per mentor) while others finish deployments.
- **Deliverable:** data statement and model card in the repo, plus the oral. **Feature freeze.**
- **Class adds:** none beyond the above.
- **AI:** allowed. Orals are closed-device for the first 4 minutes.
- **Feeds project:** final polish.

### Week 16. Demo day
Two parallel tracks of 5 teams (8 min demo plus 4 min Q&A, 60 min), then a 30-minute open gallery. Deliverables: demo, technical note (2 to 3 pages, Bahasa Indonesia), final repo.

## 3. What I cut and why
- **Classical ML weeks** (trees, SVM, k-means, PCA, kNN): no chapter in either book, and depth matters more. Baselines (majority class, mean, one scikit-learn model) appear in W7 and the projects.
- **RNN and LSTM:** transformers replaced them for the uses students will see.
- **Generative models** (GAN, VAE, flows, diffusion; UDL ch15-18): heavy math, little tie to optimization. A mention in the W14 map slide.
- **Reinforcement learning as a topic** (UDL ch19): only as optional reading for the world-model project.
- **GNNs, Bayesian optimization, Gaussian processes:** out of scope.
- **Luke ch5-7 and ch10, §4.3-4.6:** parallel methods, coevolution, multiobjective, policy optimization, GP. Multiobjective (ch7, pp 133-145) is an optional extension for strong teams.
- **UDL ch20, §8.4 double descent, the math appendices:** reference only.
- **VLA and frontier world models:** no runnable path on student hardware. One slide in W14.
- **Standalone data-quality, fairness and deployment weeks:** folded into W7 (leakage), W13 to W15 (deploy), W15 (audit, data statement, model card). I judge this enough for beginners, and a standalone fairness week would need a chapter I could not find at beginner level.
- **MLOps, Docker, cloud, AutoML:** out of scope.

## 4. Week 0 (kickoff)

### Options
| Option | What happens | For us | Against us |
|---|---|---|---|
| A. Motivation only (about 90 min) | Welcome, rules, demos | Low risk, short | Wastes the highest-attention session. Students reach W1 with broken setups and no Python |
| B. Full learning (3 h+) | Python plus first ML lesson | Maximum head start | Overwhelms zero-Python students, drives attrition, no time for setup |
| C. Hybrid (150 min, recommended) | Expectations, Python bridge, first optimizer, setup stations | One real win, setup done in the room | Tight timing. People without a laptop or account need a plan |

I recommend **C**, as a separate 150-minute session.

### Agenda (150 min)
| Min | Block |
|---|---|
| 0-10 | Welcome and why: ML grounded in optimization. One demo (Evolusi Gambar) running while the mentor speaks |
| 10-20 | Optional ungraded pretest, 12 questions, paper, anonymous code names. Used to plan clinics only |
| 20-35 | How the course works (see below) |
| 35-45 | Break |
| 45-60 | Python for Go programmers, side by side: types, lists and dicts, indentation, functions, for/range, comprehensions |
| 60-90 | Colab worksheet: translate 6 Go snippets, NumPy array basics |
| 90-95 | Break |
| 95-130 | Small win: "Optimizer 20 baris". A mystery two-parameter function, 30-evaluation budget, random-search leaderboard, debrief on what the best strategies did |
| 130-145 | Setup stations (GitHub, Colab, book download). Unfinished items become week-1 pre-work |
| 145-150 | Exit slip: one question and one worry |

### What to expect
- **Workload:** about 5 to 6 hours per week (my assumption).
- **Grading:** 40% weekly deliverables, 10% orals, 50% final project.
- **Final project:** teams of 3, deployed demo, metaheuristic compared against a baseline.
- **Attendance:** proposal, at least 13 of 16 sessions to be eligible for the certificate. **Your call.**
- **AI policy:** use any tool freely, no logs. Warm-ups and orals are closed-device. You are responsible for being able to explain your own work.

### Pre-work (about 45 min)
1. Check a Google account opens Colab and runs a cell.
2. Create a free GitHub account.
3. Download the books from official sources only: UDL from udlbook.com (GitHub release), Luke from the author's page.
4. Optional: Whirlwind Tour of Python ch. 3-5.

### Setup checklist
Colab opens and saves to Drive; GitHub account and username given to mentors; both PDFs on the laptop or phone; local Python is optional.

## 5. Week 1 site ideas

**Idea 1: Loss Landscape Explorer (recommended).** Two linked views: data with a draggable line on the left, a loss map over (intercept, slope) on the right. Dragging one updates the other. Exercises: fit by eye, find loss below a threshold by tapping the map and counting attempts, then a fog exercise (landscape hidden until 15 probes, compare with the 100 evaluations a 10x10 grid needs), and an exit question with reveal.
- *Students understand:* loss is a function of the parameters, training is finding a low point, every probe costs.
- *Effort:* M, about 3 days.
- *Risks:* reading a contour map is itself new, phone dragging on a 2D map, keyboard accessibility.

**Idea 2: Tebak Garis.** A scatter plot with a draggable line and residual squares, MSE shown live.
- *Students understand:* loss as total squared error.
- *Effort:* S to M.
- *Risks:* stays in data space, so "search" and the parameter landscape never appear. Weakest fit for the course identity.

**Idea 3: Budgeted Search Arena.** A fog-of-war landscape where each probe costs 1 evaluation, with grid and random baselines run on the same landscape and a multi-dimensional mode.
- *Students understand:* search under a budget, the curse of dimensionality.
- *Effort:* M to L.
- *Risks:* game dynamics and mental load, hard UI on phones.

## 6. Open items and unverified claims
- **Luke's edition is resolved:** Second Edition, Online Version 2.4, January 2026, read directly from the repo file.
- **Attendance threshold, communication channel, and certificate policy** are not given to me.
- **Mathematical background** of the students is assumed (derivatives, vectors, probability basics). Confirm.
- **Free-tier terms** of Hugging Face Spaces and Streamlit Community Cloud, and HF course ch9 content and license, are unverified.
- **Untested:** UDL notebooks on current Colab, torchvision and CLIP-style models on Colab free, the world-model planner demo, and all time estimates.
- The PDFs in the repo can be redistributed unmodified under their licenses (UDL: non-commercial with attribution, Luke: with attribution). Delete the superseded 2009 `Essentials.pdf`. Linking to the official sources keeps students on current versions and keeps the repo small. Your call.
