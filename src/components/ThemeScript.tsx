// This prevents the flash of wrong theme
export function ThemeScript() {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Theme initialization to prevent flashing
              function getThemePreference() {
                if (typeof localStorage !== 'undefined') {
                  if (localStorage.getItem('theme')) {
                    return localStorage.getItem('theme');
                  }
                  
                  if (localStorage.getItem('theme-storage')) {
                    try {
                      const themeStorage = JSON.parse(localStorage.getItem('theme-storage') || '{}');
                      if (themeStorage.state && themeStorage.state.theme) {
                        return themeStorage.state.theme;
                      }
                    } catch (e) {
                      console.error('Error parsing theme storage', e);
                    }
                  }
                }
                
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              const theme = getThemePreference();
              
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
        }}
      />
    );
  }