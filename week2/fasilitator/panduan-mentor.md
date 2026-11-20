# Week 2 mentor guide: gradient descent (2 hours)

Mentor-facing (English, with Indonesian lines to say aloud). Projector deck: `../slides/Pertemuan-2-Gradient-Descent.pptx`. Student notebook: `../notebooks/01_gradient_descent.ipynb`. Answer key: `kunci/01_gradient_descent_kunci.ipynb`. The Turun Lembah game in `../game/` is **not used in this version** of the session.

## 1. Idea of the session

Last week the minimum of RSS had an exact formula. Most models have none, but we can still compute the derivative wherever we stand. Gradient descent uses it as a direction: step against the slope, repeat.

We train the same linear regression on the same battery data as Week 1 because **the answer is known** (ŵ = −0.77 per minute, â = 96.6), so students can check that gradient descent works. Say this honestly if asked "why GD when a formula exists?": for plain linear regression, libraries use the formula. Next week (logistic regression) there is no formula, and today's loop is the tool.

Three skills to take home:
1. The update rule `w_baru = w − η · f′(w)` and why it works.
2. Deriving the gradient of MSE (a 1/n on top of Week 1's derivatives).
3. Finding a good learning rate for a specific dataset with a sweep.

## 2. Run sheet

| Min | Slides | Block |
|---|---|---|
| 0–10 | 1–5 | Recap of the bowl, "what if there is no formula?", walking down a mountain in fog |
| 10–30 | 6–9 | The slope gives the direction; derive the update rule; 4 steps by hand on `(w − 3)²` |
| 30–45 | 10–12 | Predict four learning rates on paper, reveal the chart, explain with `(1 − 2ηc)` |
| 45–60 | 13–17 | MSE, derive ∂MSE/∂w and ∂MSE/∂a, update both at once, one step by hand on the battery data |
| 60–100 | 18–21 | Live coding: notebook parts A, B (then slide 19) and C (slides 20–21) |
| 100–120 | 22–25 | SGD, discussion, teaser for logistic regression, before Week 3 |

## 3. Board notes and answers

**The update rule (slide 7).** From slide 6: move opposite the sign of f′(w), scaled by a number η we choose. Point out that steps shrink by themselves near the bottom because f′(w) gets small.

**Four steps by hand (slides 8–9).** `f(w) = (w − 3)²`, `f′(w) = 2(w − 3)`, start w = 0, η = 0.25:

| k | w | f′(w) | w baru |
|---|---|---|---|
| 0 | 0 | −6 | 1.5 |
| 1 | 1.5 | −3 | 2.25 |
| 2 | 2.25 | −1.5 | 2.625 |
| 3 | 2.625 | −0.75 | 2.8125 |

The distance to 3 halves each step.

**Predicting η (slide 10).** Each pair computes three steps for one row, then predicts. Collect predictions by show of hands before slide 11.

| η | w₁ | w₂ | w₃ | What happens |
|---|---|---|---|---|
| 0.05 | 0.3 | 0.57 | 0.813 | slow |
| 0.25 | 1.5 | 2.25 | 2.625 | good |
| 0.9 | 5.4 | 1.08 | 4.536 | jumps over 3 back and forth, still closing in (zig-zag) |
| 1.1 | 6.6 | −1.32 | 8.184 | jumps further each time (blows up) |

**Why (slide 12).** For `f(w) = c(w − m)²`: `w_baru − m = (1 − 2ηc)(w − m)`. The distance to the bottom is multiplied by the same factor every step. Here c = 1: η = 0.9 gives a factor of −0.8 (shrinking zig-zag), η = 1.1 gives −1.2 (growing zig-zag), η = 0.5 lands on 3 in one step. Steeper valley means smaller safe η.

**MSE derivative (slides 14–15).** Same steps as the Week 1 whiteboard, with 1/n in front:
- `∂MSE/∂w = (1/n) Σ 2(yᵢ − w·xᵢ − a)(−xᵢ) = −(2/n) Σ xᵢeᵢ`
- `∂MSE/∂a = (1/n) Σ 2(yᵢ − w·xᵢ − a)(−1) = −(2/n) Σ eᵢ`

Key sentence: *"Pekan lalu turunan ini disamakan dengan nol lalu diselesaikan. Hari ini dipakai sebagai arah langkah."*

**One step on the battery data (slide 17).** x in tens of minutes (0 to 4), y = 97, 89, 80, 74, 66, start w = a = 0, η = 0.1. Σe = 406, Σxe = 735, ∂MSE/∂w = −294, ∂MSE/∂a = −162.4, so **w = 29.4, a = 16.24**. Why does w go up first? The line starts at height 0 and all points are far above it; tilting up is the fastest way to raise it. A few steps later a has caught up and w turns around (visible in the path plot).

Why tens of minutes: with x in minutes, η must stay below about 0.0016 and it needs about 10,000 steps.

## 4. Live coding (notebook)

The first cell holds helpers (data, plots, checks): run it, do not read it in class. Students write every part of gradient descent.

| Part | Students write | Check |
|---|---|---|
| A1 | `mse(w, a)` | mse(0, 0) = 6712.4, mse(−7.7, 96.6) = 0.38 |
| A2 | `gradien(w, a)` returning `(gw, ga)` | `cek_gradien` compares with a numerical estimate at 5 random points |
| B1 | `gradient_descent(w, a, eta, langkah)` storing `(w, a, mse)` each step | one step from (0, 0), η = 0.1 gives (29.4, 16.24) |
| B2 | run only | 300 steps reach w = −7.7, a = 96.6; `cek_hasil` compares with the Week 1 formula |
| B3 | run only | η = 0.01 too slow, 0.14 arrives, 0.15 blows up |
| C1 | the sweep loop (`hasil[eta] = gradient_descent(0, 0, eta, 100)`) | 6 values, 100 steps each |
| C2 | choose values near the cliff and sweep again | best η between 0.12 and 0.149 |
| C3 | run only | the same sweep with x in minutes |

**Expected sweep results (100 steps from (0, 0)).**
- Coarse: 0.001 → MSE 2601; 0.003 → 1833; 0.01 → 792; 0.03 → 71; 0.1 → 0.392; 0.3 blows up.
- Zoom: 0.11 → 0.383; 0.12 → 0.381; 0.13 → 0.380; **0.14 → 0.380 (best)**; 0.145 → 0.416 (worse, though stable); 0.15 blows up.
- Theory, if a student asks: the limit is η < 0.149 (2 divided by the largest curvature of the MSE bowl), and the best constant η is about 0.143.
- Minutes: best η 0.0015 with MSE 2543 after 100 steps, against a reachable minimum of 0.38. Even the best η needs about 6,800 steps.

**The method to say out loud (slide 20):** define "best" with a fixed budget, sweep on a log scale (each value about 3 times the last), zoom in where it turns from good to exploding, pick the largest stable value just below the cliff. And from C3: the best η belongs to the dataset; if every η is slow, rescale the data.

**Common mistakes.**
- Updating w first, then computing the gradient for a with the new w. Both gradients must use the old values (`w, a = w - eta*gw, a - eta*ga` does this).
- Forgetting the minus sign in the gradient (GD then climbs: MSE grows every step).
- Forgetting `/ n` in the gradient (that is, using the RSS gradient): it still works, but the good η becomes n = 5 times smaller. The notebook writes `np.sum(...) / n` on purpose, so the code mirrors the formula: `np.sum` is Σ and `/ n` is 1/n.
- Re-running cells out of order after editing a function: use Runtime, then Run all.

If time runs short, do C3 as a demo on the projector.

## 5. Discussion (slide 23): expected answers

1. Why GD when a formula exists? Today is a test bench where the answer is known; the formula disappears for most models, the loop does not change.
2. Why does the best η change in minutes? Rescaling x changes how steep the valley is in the w direction, so the safe step size changes.
3. What does GD need? The derivative at the current point. It does not need to solve any equation. Without even a derivative: metaheuristics (Weeks 9 to 12).

## 6. Before class

- **Colab link.** The badge in the notebook points to `main`. Until the branch is merged, upload `week2/notebooks/01_gradient_descent.ipynb` to Colab (File, Upload notebook) or share the file.
- **The pass/fail data** on the teaser slide is made up for illustration.
- **Reading for Week 3:** UDL sections 5.1 to 5.4, printed pages 56 to 67.
