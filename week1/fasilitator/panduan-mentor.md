# Week 1 mentor guide: linear regression with least squares (2 hours)

Mentor-facing (English, with Indonesian lines to say aloud). Projector deck: `../slides/`. Student notebook: `../notebooks/01_least_squares.ipynb`. Answer key: `kunci/01_least_squares_kunci.ipynb`. Nothing in `fasilitator/` is meant for students.

## 1. Idea of the session

Training a linear regression **is an optimization problem**: choose `w` and `a` to minimise the sum of squared errors. For a straight line with squared error the minimum has an exact formula, found by setting the partial derivatives to zero. The lead mentor derives it at the front; students apply the formula by hand, then in pure Python.

The closing point sets up Week 2: this only worked because the model is a line and the error is squared. Most models (a neural network, the komodo brain in Flappy Komodo) have no such formula.

**Teaching example:** Go-car fares (positive relationship), from Dr. Didit Adytia, S.Si., M.Si. (Machine Learning course, Informatika Telkom University). Credit him when you introduce the example; the credit is also on slide 4 and in the notebook.
**Exercise data:** phone battery against minutes of gaming (negative relationship). The numbers are designed for the exercises, not measured. Say so if asked.

## 2. Notation (follows the course material)

| Item | Notation |
|---|---|
| Model | `f(x) = w·x + a` (`w` slope, `a` intercept) |
| Data | `n` pairs `(xᵢ, yᵢ)` |
| Prediction, observation | `ŷᵢ`, `yᵢ` |
| Error (residual) | `εᵢ = yᵢ − ŷᵢ` |
| Objective (SSE) | `E(w, a) = Σ (yᵢ − w·xᵢ − a)²` |
| Solution | `â = ȳ − w·x̄` (4), `ŵ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²` (7) |

Two traps to say out loud:
- **Week 0 used `tarif = a × jarak + b`**, with `a` as the slope. From today `w` is the slope and `a` is the intercept (slide 6).
- The course material writes the line through two points as `y = a + mx` on one slide and reuses `ε` for the squared error on another. We use `w` for the slope throughout and keep `εᵢ` as the plain error, `SSE = Σ εᵢ²`.

Week 0 showed the *mean* of squared errors (MSE). SSE is the sum. Same best line, because dividing by `n` does not move the minimum.

## 3. Run sheet

| Min | Slides | Block | Who |
|---|---|---|---|
| 0–10 | 1–3 | Opening quiz, closed device, self-checked | Lead |
| 10–25 | 4–10 | Problem, data, model, guessed line, error, SSE, the optimization framing | Lead |
| 25–45 | 11–18 | Calculus reminder, derivation, Go-car answer, meaning, why it is a minimum | Lead at the board; students fill in one step |
| 45–70 | 19–20 | Exercises 1 to 3 on paper, in pairs | All mentors walk |
| 70–105 | 21 | Exercises 4 and 5 in Colab | All mentors walk |
| 105–120 | 22–23 | Discussion and Week 2 preview | Lead |

Before class: check that the Colab link opens (it needs the `week1` folder on `main`; see section 10), and that the projector shows the formula images sharply.

## 4. Opening quiz (slide 3): answers

1. B: it has the smallest error.
2. The slope and the intercept (`a` and `b` in Week 0's notation).
3. Follow the slope (gradient descent) and try-and-keep-the-best (metaheuristics).
4. 600 komodos: how many tries evolution may use.

Say: *"Nomor 2 penting: dua kenop itu hari ini mendapat nama baru."*

## 5. The derivation (slides 11 to 15)

Write it on the board, slowly. The slides show each line, so you can point instead of writing if time is short.

**Calculus reminder (slide 11).** Ask: *"Siapa yang sudah belajar turunan parsial?"* If many hands stay down, give the one rule: *"Saat menurunkan terhadap satu variabel, anggap semua huruf lain sebagai angka biasa."* Example: `d/da (5 − a)² = 2(5 − a)(−1)`.

**Step 1, students' turn (slide 12, 3 minutes).** Expected answer:
`∂E/∂a = Σ 2(yᵢ − w·xᵢ − a)(−1) = −2 Σ (yᵢ − w·xᵢ − a)`.

**Step 1, solve (slide 13).** Set to zero, divide by −2: `Σyᵢ − w·Σxᵢ − n·a = 0`. Divide by `n`: `ȳ − w·x̄ − a = 0`, so `â = ȳ − w·x̄` (4).
Say: *"Artinya garis terbaik selalu lewat titik (x̄, ȳ), pusat data."*

**Step 2 (slide 14).** `∂E/∂w = −2 Σ xᵢ(yᵢ − w·xᵢ − a)`. Set to zero, substitute (4): `0 = Σ xᵢ(yᵢ − w·xᵢ − ȳ + w·x̄)`. Group the `w` terms: `Σ xᵢ(yᵢ − ȳ) = w·Σ xᵢ(xᵢ − x̄)`, which gives (6). The substitution is where students get lost; pause there.

**(6) to (7), the take-home challenge.** Because `Σ(xᵢ − x̄) = 0`, both `Σ x̄(yᵢ − ȳ)` and `Σ x̄(xᵢ − x̄)` are zero, so they can be subtracted from the numerator and denominator of (6) without changing it. That turns `xᵢ` into `(xᵢ − x̄)`.

**Go-car numbers (slide 16).** `x̄ = 9.133 km`, `ȳ = Rp55,553.3`, `ŵ = 5,737.72`, `â = 3,148.78`. SSE of the least squares line = 296,861,703. SSE of the guessed line `y = 8800 + 5040x` = 355,166,000, about 20% larger. Prediction for 20 km: about Rp117,903 (outside the 5 to 13 km data: say it is extrapolation).

## 6. Exercises 1 to 3 (paper): full working

Data (slide 19): `x = 0, 10, 20, 30, 40` minutes, `y = 97, 89, 80, 74, 66` %.

| x | y | x − x̄ | y − ȳ | (x − x̄)(y − ȳ) | (x − x̄)² |
|---|---|---|---|---|---|
| 0 | 97 | −20 | 15.8 | −316 | 400 |
| 10 | 89 | −10 | 7.8 | −78 | 100 |
| 20 | 80 | 0 | −1.2 | 0 | 0 |
| 30 | 74 | 10 | −7.2 | −72 | 100 |
| 40 | 66 | 20 | −15.2 | −304 | 400 |
| | | | **Sum** | **−770** | **1000** |

1. `x̄ = 20`, `ȳ = 81.2`, `ŵ = −770 / 1000 = −0.77`, `â = 81.2 − (−0.77)(20) = 96.6`.
2. Least squares predictions 96.6, 88.9, 81.2, 73.5, 65.8; errors 0.4, 0.1, −1.2, 0.5, 0.2; **SSE = 1.90**.
   Line through the first and last points: slope `(66 − 97)/40 = −0.775`, intercept 97; predictions 97, 89.25, 81.5, 73.75, 66; errors 0, −0.25, −1.5, 0.25, 0; **SSE = 2.375**. Least squares wins, as with Go-car.
3. `ŵ`: the battery drops about 0.77% per minute of gaming. `â`: about 96.6% at the start, according to the line (the recorded value was 97). After 60 min: `96.6 − 0.77 × 60 = 50.4%`. Empty when `−0.77x + 96.6 = 0`, so `x ≈ 125` minutes (about 2 hours 5 minutes). After 180 min: `−42%`: impossible, because the line is extended far beyond the data.

Common mistakes: forgetting that `ŵ` is negative; using `Σxy / Σx²` (no centring); computing `â` with the wrong sign of `ŵ`.

## 7. Exercises 4 and 5 (Colab, pure Python)

The notebook starts with six short Python items (variables, lists, `for`, `sum` and list comprehensions, `zip`, functions), each with a Go comparison. Then students write `hitung_w`, `hitung_a`, `prediksi` and `sse`. Each one is tested on the Go-car data first, because students already know the answer from the slides. Every exercise cell has an automatic check that prints `Benar.` or a hint.

Expected values on the 19 battery records: `ŵ = −0.8270`, `â = 97.6368`, `SSE = 16.23`, empty after about 118 minutes, prediction for 180 minutes −51.2%. `statistics.linear_regression` (Python standard library, 3.10 and newer) must give the same slope and intercept.

Exercise 5:
- **5a:** `ZeroDivisionError`. Every `xᵢ` equals `x̄`, so the denominator of (7) is zero: with no variation in `x`, the slope is undefined.
- **5b:** typing 6 instead of 65 at minute 40 moves `â` from about 97.6 to 93.6, while `ŵ` barely moves (−0.827 to −0.806). Squared error lets one large mistake pull the whole line.

Python problems you will see:
- `IndentationError`: the loop body must be indented (4 spaces).
- `TypeError: unsupported operand ... NoneType`: a function still contains `...` and returns nothing. Fill in the earlier cells first.
- Cells run out of order after a restart: *Runtime → Run all*.
- `menit.index(40)` is the position, not the value: change `baterai_salah[i]`, not `baterai`.

## 8. Discussion (slide 22): expected answers

1. A straight line with squared error makes SSE a bowl whose derivatives are linear in `w` and `a`, so the two "derivative = 0" equations can be solved directly.
2. Real data has typos and outliers, and squared error is sensitive to them (Week 7 returns to honest evaluation).
3. No. The komodo brain is a neural network with many parameters, and its score comes from playing a game. There is no formula for its best parameters: we need gradient descent (Week 2) or metaheuristics (Weeks 9 to 12).

## 9. Deliverable

Finished notebook plus the two understanding questions at its end (2 to 3 sentences each). The answer key has sample answers.

## 10. Before class

- **Colab link.** The badge in the notebook points to `main`. Merge the working branch so `week1/notebooks/01_least_squares.ipynb` exists on `main`, or share the file another way.
- **Calculus background.** Unconfirmed: the 2025 cohort may not have met partial derivatives. The slide 11 reminder assumes they have seen ordinary derivatives.
- **Reading for Week 2:** UDL sections 6.1 and 6.2, printed pages 77 to 85.
