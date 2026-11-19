import "./globals.css";

export const metadata = {
  title: "Turun Lembah",
  description: "A gradient descent game: one attempt per level, so understanding beats guessing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top"><div className="bar">
          <a className="brand" href="/">Turun Lembah</a>
          <nav><a href="/play">Play</a><a href="/practice">Practice</a></nav>
        </div></header>
        {children}
      </body>
    </html>
  );
}
