# Week 3 kit: logistic regression

Predict pass or fail instead of a number. A straight line through 0/1 data gives values below 0 and above 1, so we pass the Week 1 line through a sigmoid and read the output as a probability. Choosing between models needs a new loss (binary cross-entropy), its gradient turns out to have the same shape as Week 2's, and there is no exact formula for the minimum, so the Week 2 gradient descent loop does the training.

The derivation is kept medium (about 15 minutes) so that live coding gets 55 minutes.

| Folder | For | What |
|---|---|---|
| `slides/` | Mentors (projector) | 27-slide deck on the lab template, speaker notes with timings, PDF backup |
| `notebooks/` | Students (Colab) | `01_logistic_regression.ipynb`: a helper cell (data, plots, checks), then students write the sigmoid, the prediction, BCE, the gradient, the GD loop, a learning-rate sweep and a two-feature version, each with an automatic check |
| `fasilitator/` | Mentors only | `panduan-mentor.md` (run sheet, board notes, all worked answers, expected numbers) and `kunci/` (answer key) |

Flow: the problem (pass/fail against study hours), the sigmoid and three values by hand, the decision boundary x = −a/w, three models with the same boundary and the same accuracy, why "sure and wrong" must cost more (−ln p against (1 − p)²), BCE, why MSE with a sigmoid learns slowly, σ′ = σ(1 − σ) derived by students, the chain rule and the cancellation to p − y, "no formula, so gradient descent", live coding (parts A to E), and a discussion on 95% accuracy with imbalanced data.

Train/test splits are not in this week: they move to Week 7.

Start with `fasilitator/panduan-mentor.md`.
