# Week 1 kit: linear regression with least squares

Training a linear regression framed as an optimization problem. Students first judge by eye which of four lines fits the Go-car data best; since a computer cannot see, we define a metric, the residual sum of squares (RSS). Then we choose the slope `w` and intercept `a` that minimise RSS, solved exactly by setting the partial derivatives to zero. The lead mentor derives the formula at the front; students apply it by hand, then in pure Python.

| Folder | For | What |
|---|---|---|
| `slides/` | Mentors (projector) | 29-slide deck on the lab template, with speaker notes and timings, plus a PDF backup |
| `notebooks/` | Students (Colab) | `01_least_squares.ipynb`: the least squares formula in pure Python (no NumPy), written together in a live-coding session, with automatic checks |
| `fasilitator/` | Mentors only | `panduan-mentor.md` (run sheet, derivation script, full exercise working) and `kunci/` (answer-key notebook) |

- **Notation** follows the course material: `f(x) = w·x + a`, `εᵢ = yᵢ − ŷᵢ`, `RSS(w, a) = Σ (yᵢ − w·xᵢ − a)²` (called SSE in the course material), `â = ȳ − w·x̄`, `ŵ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²`.
- **Teaching example:** Go-car fares (positive relationship), from Dr. Didit Adytia, S.Si., M.Si. (Machine Learning course, Informatika Telkom University).
- **Exercises:** phone battery against minutes of gaming (negative relationship). The exercise data is designed for the exercises, not measured.

Start with `fasilitator/panduan-mentor.md`.
