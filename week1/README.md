# Week 1 kit: linear regression with least squares

Training a linear regression framed as an optimization problem: choose the slope `w` and intercept `a` that minimise the sum of squared errors, and solve it exactly by setting the partial derivatives to zero. The lead mentor derives the formula at the front; students apply it by hand, then in pure Python.

| Folder | For | What |
|---|---|---|
| `slides/` | Mentors (projector) | 24-slide deck on the lab template, with speaker notes and timings, plus a PDF backup |
| `notebooks/` | Students (Colab) | `01_least_squares.ipynb`: just enough Python for Go programmers, then the least squares formula in pure Python (no NumPy), with automatic checks |
| `fasilitator/` | Mentors only | `panduan-mentor.md` (run sheet, derivation script, full exercise working) and `kunci/` (answer-key notebook) |

- **Notation** follows the course material: `f(x) = w·x + a`, `εᵢ = yᵢ − ŷᵢ`, `E(w, a) = Σ (yᵢ − w·xᵢ − a)²` (SSE), `â = ȳ − w·x̄`, `ŵ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²`.
- **Teaching example:** Go-car fares (positive relationship), from Dr. Didit Adytia, S.Si., M.Si. (Machine Learning course, Informatika Telkom University).
- **Exercises:** phone battery against minutes of gaming (negative relationship). The exercise data is designed for the exercises, not measured.

Start with `fasilitator/panduan-mentor.md`.
