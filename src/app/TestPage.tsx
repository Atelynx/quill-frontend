import PagesBar from '../components/Links.component';
import { Button } from '@/components/atoms/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/themeSlice';
import { themes } from '@/styles/themes';
import type { ThemeName } from '@/styles/themes';

function TestPage() {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector((state) => state.theme);
  const themeEntries = Object.entries(themes) as [ThemeName, (typeof themes)[ThemeName]][];

  return (
    <div className="bg-background text-text w-full min-h-screen">
      <header>
        <PagesBar />
      </header>

      <section className="px-6 py-10 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-xl border border-text/20 bg-background p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-center">Theme Test Page</h1>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm mb-3">Choose a theme:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {themeEntries.map(([themeName, theme]) => (
                <button
                  key={themeName}
                  type="button"
                  onClick={() => dispatch(setTheme(themeName))}
                  className={`text-sm underline underline-offset-4 transition-opacity ${
                    currentTheme === themeName ? 'font-semibold text-primary' : 'text-text/80 hover:text-text'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TestPage;
