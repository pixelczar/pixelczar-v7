"use client"

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('pixel-czar-theme');
        if (!theme) {
          theme = 'dark';
          localStorage.setItem('pixel-czar-theme', 'dark');
        }
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
