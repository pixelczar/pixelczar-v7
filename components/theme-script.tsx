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
        
        // Initialize dark theme variant
        var darkVariant = localStorage.getItem('dark-theme-variant');
        if (!darkVariant) {
          darkVariant = 'midnight';
          localStorage.setItem('dark-theme-variant', darkVariant);
        }
        document.documentElement.setAttribute('data-dark-variant', darkVariant);
      } catch (e) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-dark-variant', 'midnight');
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
