// This prevents the flash of wrong theme
export function ThemeScript() {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Theme initialization to prevent flashing
              function getThemePreference() {
                if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                  return localStorage.getItem('theme');
                }
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              const theme = getThemePreference();
              document.documentElement.classList.add(theme);
            })();
          `,
        }}
      />
    );
  }