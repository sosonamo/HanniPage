import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MembersPage } from './components/MembersPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="hanni-site min-h-screen bg-slate-950 text-slate-100 font-sans">
      <MembersPage />
    </div>
  </StrictMode>,
);
