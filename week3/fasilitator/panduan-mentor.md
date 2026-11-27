# Week 3 mentor guide: logistic regression (2 hours)

Mentor-facing (English, with Indonesian lines to say aloud). Projector deck: `../slides/Pertemuan-3-Regresi-Logistik.pptx`. Student notebook: `../notebooks/01_regresi_logistik.ipynb`. Answer key: `kunci/01_regresi_logistik_kunci.ipynb`.

## 1. Idea of the session

Weeks 1 and 2 predicted a number. Today the answer is yes or no. We keep the Week 1 line `w·x + a`, pass it through a sigmoid to get a probability, and need a loss that can tell good probabilities from bad ones. Its gradient has the same shape as the MSE gradient, but setting it to zero has no algebraic solution, which is the promise from last week: the gradient descent loop is now the only option.

Three skills to take home:
1. Compute `p = σ(w·x + a)` and the decision boundary `x = −a/w`.
2. Explain why BCE punishes "sure and wrong" heavily, and follow the derivation to `∂ℓ/∂z = p − y`.
3. Train logistic regression with GD in NumPy, including a learning-rate sweep and a second feature.

The derivation is medium on purpose: students derive σ′ themselves (5 lines), the lead mentor does the chain rule and the cancellation. Live coding gets 55 minutes.

## 2. Run sheet

| Min | Slides | Block |
|---|---|---|
| 0–8 | 1–4 | The pass/fail data, a straight line fails, we want a probability |
| 8–20 | 5–9 | Sigmoid, the model, three values by hand, decision boundary, what w and a do |
| 20–35 | 10–14 | Three models with the same accuracy, penalty table, BCE, BCE of the candidates, why not MSE |
| 35–50 | 15–19 | σ′ (students), chain rule, cancellation, result next to the MSE gradient, no formula |
| 50–105 | 20–24 | Live coding: parts A, B (then slide 21), C (slide 22), D (slide 23), E as a demo |
| 105–120 | 25–27 | Discussion on accuracy, teaser for neural networks, before Week 4 |

## 3. Data

20 students, study hours x = 0.5, 1, …, 10 (step 0.5). Results y:

| x | 0.5–3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7 | 7.5–10 |
|---|---|---|---|---|---|---|---|---|---|---|
| y | 0 (six students) | 1 | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 1 (six students) |

10 passed, 10 failed. Made up for teaching; say so if asked. The overlap in the middle (3.5 h passed, 7 h failed) is deliberate: it is why the model gives probabilities.

Least squares line on this data: ŷ = 0.126·x − 0.163, so −0.16 at 0 hours and 1.16 at 10.5 hours (slide 3).

## 4. Board notes and answers

**Sigmoid (slide 5).** Let students reason the three bullets from the formula.

**Three values by hand (slide 7).** w = 1, a = −5, so z = x − 5.

| x | z | e^(−z) | p | Guess |
|---|---|---|---|---|
| 3 | −2 | 7.389 | 0.119 | fail |
| 5 | 0 | 1 | 0.5 | on the boundary |
| 7 | 2 | 0.135 | 0.881 | pass |

**Decision boundary (slide 8).** σ(z) = 0.5 exactly when z = 0, so the boundary is `w·x + a = 0`, `x = −a/w` = 5 hours here.

**What w and a do (slide 9).** w sets how steep (how sure), −a/w sets where. The three curves on the left all switch at 5 hours: same predictions, so counting correct answers cannot choose between them.

**Three models (slide 10).** A (w = 1, a = −5), B (0.3, −1.5), C (3, −15). All three get 17 of 20 right (85%): wrong on 3.5 h (passed), 5.5 h and 7 h (failed). For the 7-hour student who failed: A says p = 0.88, B 0.65, C 0.998.

**Penalty table (slide 11).** For a student who passed (y = 1):

| p | −ln p | (1 − p)² |
|---|---|---|
| 0.9 | 0.105 | 0.01 |
| 0.5 | 0.693 | 0.25 |
| 0.1 | 2.303 | 0.81 |
| 0.01 | 4.605 | 0.98 |

The squared error never costs more than 1; −ln p has no upper limit.

**BCE (slide 12).** `ℓ = −[y ln p + (1 − y) ln(1 − p)]`. Let students check both cases: y = 1 leaves −ln p, y = 0 leaves −ln(1 − p). If someone asks where it comes from: it is the negative log-likelihood of the data under the model (UDL 5.4). Not needed today.

**BCE of the candidates (slide 13).**

| Model | w | a | Accuracy | BCE |
|---|---|---|---|---|
| A | 1 | −5 | 85% | 0.365 |
| B | 0.3 | −1.5 | 85% | 0.468 |
| C | 3 | −15 | 85% | 0.661 |
| Best (GD) | 0.871 | −4.572 | 80% | 0.359 |

C's biggest cost is the 7-hour student: −ln(1 − 0.998) ≈ 6.0, against 2.13 for A. The best model's boundary is 5.25 h, so it gets the 5-hour student wrong and has lower accuracy than A. Keep that for the discussion: the loss we train on and the metric we report are different choices.

**Why not MSE (slide 14).** Gradient of the loss with respect to z for one point with y = 1. BCE: p − y. MSE with sigmoid: 2(p − y)·p(1 − p). At p = 0.01: BCE 0.99, MSE 0.0196. The confidently wrong point barely moves under MSE.

**σ′ (slide 15), students in pairs.**
1. σ = (1 + e^(−z))^(−1)
2. σ′ = −(1 + e^(−z))^(−2) · (−e^(−z)) = e^(−z) / (1 + e^(−z))²
3. = [1 / (1 + e^(−z))] · [e^(−z) / (1 + e^(−z))]
4. e^(−z) / (1 + e^(−z)) = ((1 + e^(−z)) − 1) / (1 + e^(−z)) = 1 − σ
5. σ′ = σ(1 − σ)

Give the hint for line 4 (add and subtract 1) only if a pair is stuck.

**Chain rule and cancellation (slides 16–17), lead mentor.**
- ∂ℓ/∂p = −y/p + (1 − y)/(1 − p)
- ∂p/∂z = p(1 − p)
- ∂ℓ/∂z = (−y/p + (1 − y)/(1 − p)) · p(1 − p) = −y(1 − p) + (1 − y)p = −y + yp + p − yp = **p − y**
- ∂z/∂w = x, ∂z/∂a = 1, so ∂ℓ/∂w = (p − y)x and ∂ℓ/∂a = p − y.

Key sentence: *"p(1 − p) dari sigmoid tercoret habis oleh penyebut dari logaritma. Karena itu BCE dan sigmoid selalu dipasangkan."*

**Result (slide 18).** ∂L/∂w = (1/n)Σ(pᵢ − yᵢ)xᵢ, ∂L/∂a = (1/n)Σ(pᵢ − yᵢ). Last week's ∂MSE/∂w = −(2/n)Σxᵢeᵢ, rewritten with (ŷᵢ − yᵢ) = −eᵢ, is (2/n)Σ(ŷᵢ − yᵢ)xᵢ: same shape, only the prediction changed.

**No formula (slide 19).** Setting the gradient to zero leaves w and a inside exponentials; no algebra isolates them. BCE for logistic regression is convex (a single bowl), so GD finds the one minimum. Mention only if asked.

## 5. Live coding (notebook)

The first cell holds data, plots and checks: run it, do not read it in class. Students write the model, the loss, the gradient and the loops.

| Part | Students write | Check |
|---|---|---|
| A1 | `sigmoid(z)` | σ(0) = 0.5, σ(10) ≈ 1, σ(−10) ≈ 0 |
| A2 | `prediksi(w, a)` | x = 3, 5, 7 with w = 1, a = −5 gives 0.119, 0.5, 0.881 |
| A3 | `bce(w, a)` (the `np.clip` line is given) | A, B, C give 0.365, 0.468, 0.661 |
| A4 | run only | BCE and accuracy of A, B, C; curve of C |
| B1 | `gradien(w, a)` | `cek_gradien` compares with a numerical estimate at 5 random points |
| B2 | `gradient_descent(w, a, eta, langkah)` | one step from (0, 0), η = 0.3 gives w = 0.315, a = 0 |
| B3 | run only | 3000 steps, η = 0.3: w = 0.8708, a = −4.5718, BCE 0.3592, boundary 5.25 h, accuracy 80% |
| C1 | the sweep loop (300 steps each) | 6 values |
| C2 | values between 0.3 and 1 | best η about 0.5 |
| C3 | run only | the first 50 steps for η = 0.3, 0.5, 1 |
| D1 | `prediksi_2d`, `gradien_2d` (`bce_2d` is given) | `cek_gradien_2d` |
| D2 | `gradient_descent_2d(eta, langkah)` | one step, η = 0.3: w1 = 0.168, w2 = 0.0544, a = −0.015 |
| D3 | run only | η = 0.1 against 0.3; boundary plot |
| E | run only | the "always normal" model: 95% accuracy, 0 of 50 frauds caught |

Why one step from (0, 0) gives a = 0: every p is 0.5 and there are 10 passes and 10 fails, so Σ(pᵢ − yᵢ) = 0. ∂L/∂w = (0.5·105 − 73.5)/20 = −1.05, so w = 0 − 0.3·(−1.05) = 0.315. Good to say out loud if a student doubts their check.

**Expected sweep results (BCE after 300 steps from (0, 0)).**
- Coarse: 0.01 → 0.571; 0.03 → 0.493; 0.1 → 0.399; 0.3 → 0.364; 1 → 0.689; 3 is erratic (around 1.0 to 1.3, depends on rounding).
- Zoom: 0.3 → 0.364; 0.4 → 0.361; **0.5 → 0.360 (best)**; 0.6 → 0.377; 0.7 → 0.454; 0.8 → 0.435; 1 → 0.689.
- Difference from Week 2: BCE does not shoot to infinity when η is too large. It zig-zags and stays bad, and the curve is not smooth above the best value.
- C3: η = 0.5 jumps up to 1.6 in the first steps before settling; η = 1 keeps jumping between about 0.5 and 4.6. Point: "terbaik dalam 300 langkah" does not mean smooth.

**Part D, two features (40 students, made-up data).** 18 passed, 22 failed. 3000 steps with η = 0.3: w1 = 0.893, w2 = 0.959, a = −11.098, BCE 0.284, accuracy 90%. With η = 0.1 the loss falls smoothly but reaches only 0.296 after 3000 steps. With η = 0.3 it zig-zags up to about 3 in the first 800 steps and then ends lower. Same story as x in minutes in Week 2: a must travel to −11 while w1 and w2 stay near 1, so the valley is long and thin. Feature scaling fixes this (a later week).

**Common mistakes.**
- `np.exp(z)` instead of `np.exp(-z)` in the sigmoid: σ(10) comes out near 0. The A1 check catches it.
- Using `y - p` instead of `p - y` in the gradient: GD climbs and BCE grows. `cek_gradien` catches the sign.
- Removing `np.clip` in BCE: with a large η some p become exactly 0 or 1 and BCE turns into `nan`.
- Updating w first, then computing the gradient for a with the new w (same as Week 2).
- Re-running cells out of order after editing a function: Runtime, then Run all.

If time runs short, do D3 and E as demos on the projector.

## 6. Discussion (slide 25): expected answers

1. Transactions, 95% normal, a model that always says "normal": 95% accuracy, catches zero frauds. Useless. On imbalanced data, always compare with the "always the majority class" baseline and look at how many of the small class are caught (precision and recall come later).
2. Why train with BCE when we report accuracy? Accuracy only changes when a point crosses the boundary, so as a function of w and a it is a staircase with derivative zero almost everywhere; GD gets no direction. BCE is smooth and also punishes overconfidence.
3. Who chooses the loss? We do. The loss is the objective of the optimization problem. In Week 10 a genetic algorithm maximizes a fitness, which is a loss with the sign flipped.

Train/test splits are in Week 7. Do not open that topic today.

## 7. Before class

- **Colab link.** The badge in the notebook points to `main`. Until the branch is merged, upload `week3/notebooks/01_regresi_logistik.ipynb` to Colab (File, Upload notebook) or share the file.
- **Calculators.** Phones are fine for e^(−z) on slide 7.
- **Reading for Week 4:** UDL sections 3.1 to 3.4 (printed pages 25 to 35) and 4.1 to 4.3 (pages 41 to 48).
