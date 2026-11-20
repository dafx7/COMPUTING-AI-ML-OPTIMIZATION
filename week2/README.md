# Week 2 kit: gradient descent

When there is no formula for the minimum, use the derivative as a direction. The session trains the same linear regression on the same battery data as Week 1, so students can check that gradient descent reaches the known answer (w = −0.77 per minute, a = 96.6), and then learn to find a good learning rate for a specific dataset.

| Folder | For | What |
|---|---|---|
| `slides/` | Mentors (projector) | 26-slide deck on the lab template, speaker notes with timings, PDF backup |
| `notebooks/` | Students (Colab) | `01_gradient_descent.ipynb`: a helper cell (data, plots, checks), then students write MSE, the gradient, the GD loop and a learning-rate sweep, each with an automatic check |
| `fasilitator/` | Mentors only | `panduan-mentor.md` (run sheet, board notes, all worked answers, expected sweep numbers) and `kunci/` (answer key) |
| `game/` | Optional | Turun Lembah, a gradient descent game for Vercel. Not used in the current version of the session |

Flow: the update rule derived at the board, four steps by hand, predicting four learning rates on paper, why `η × 2c` decides the outcome, deriving ∂MSE/∂w and ∂MSE/∂a, live coding, the learning-rate sweep (best η just below the cliff; the best η belongs to the dataset), SGD, and a teaser for logistic regression.

Start with `fasilitator/panduan-mentor.md`.
