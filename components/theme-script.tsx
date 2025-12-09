"use client"

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('pixel-czar-theme');
        if (!theme) {
          // Check system preference
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? 'dark' : 'light';
        }
        
        // Apply theme based on stored preference or system preference
        var isDark = false;
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'light') {
          isDark = false;
        } else {
          // theme is 'system' or invalid, check system preference
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.setAttribute('data-theme', theme || 'system');
        
        // Initialize dark theme variant
        var darkVariant = localStorage.getItem('dark-theme-variant');
        if (!darkVariant) {
          darkVariant = 'original';
          localStorage.setItem('dark-theme-variant', darkVariant);
        }
        document.documentElement.setAttribute('data-dark-variant', darkVariant);
      } catch (e) {
        // Fallback: check system preference
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        document.documentElement.setAttribute('data-theme', 'system');
        document.documentElement.setAttribute('data-dark-variant', 'original');
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
