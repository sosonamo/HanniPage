import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft } from 'lucide-react';
import { MembersPage } from './components/MembersPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="hanni-site min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <a href={import.meta.env.BASE_URL} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 홈페이지로
          </a>
          <span className="headline-font text-xl tracking-wider">HANNI THE BLAZERS</span>
        </div>
      </header>
      <main><MembersPage /></main>
    </div>
  </StrictMode>,
);
