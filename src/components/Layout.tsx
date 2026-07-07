import {NavLink,Outlet,useNavigate} from 'react-router-dom';
import {
  Heart,
  Home,
  Compass,
  Film,
  Music,
  Search,
  Sun,
  Moon,
  UserRound,
  Menu,
  Clock3,
  X
} from 'lucide-react';
import {useState} from 'react';
import {useTheme} from '../hooks/useTheme';

export function Layout(){
  const {mode,setMode}=useTheme();
  const [open,setOpen]=useState(false);
  const nav=useNavigate();

  const links=[
    ['/','Início',Home],
    ['/discover','Descobrir',Compass],
    ['/movies','Filmes',Film],
    ['/music','Música',Music],
    ['/favorites','Favoritos',Heart],
    ['/history','Histórico',Clock3]
  ] as const;

  const themeLabel=
    mode==='dark'
      ? 'Tema claro'
      : mode==='light'
        ? 'Tema escuro'
        : 'Tema';

  const toggleTheme=()=>{
    if(mode==='dark'){
      setMode('light');
    }else{
      setMode('dark');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 transition-colors duration-500 dark:bg-[#0b0b0c] dark:text-zinc-100 light:bg-[#f6f6f3] light:text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0c]/90 backdrop-blur-xl light:border-black/10 light:bg-[#f6f6f3]/90">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

          <button
            onClick={()=>nav('/')}
            className="text-xl font-black tracking-[-.06em] transition-opacity hover:opacity-70"
          >
            VIBES<span className="text-zinc-400">.</span>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map(([to,label,Icon])=>(
              <NavLink
                key={to}
                to={to}
                className={({isActive})=>
                  `group flex items-center gap-2 text-sm transition ${
                    isActive
                      ? 'font-medium text-white light:text-zinc-950'
                      : 'text-zinc-500 hover:text-white light:hover:text-zinc-900'
                  }`
                }
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:-translate-y-px"
                />

                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              aria-label="Buscar"
              onClick={()=>nav('/search')}
              className="rounded-full p-2.5 text-zinc-500 transition hover:bg-white/10 hover:text-white light:hover:bg-black/5 light:hover:text-zinc-900"
            >
              <Search size={18}/>
            </button>

            <button
              aria-label={themeLabel}
              onClick={toggleTheme}
              className="rounded-full p-2.5 text-zinc-500 transition hover:bg-white/10 hover:text-white light:hover:bg-black/5 light:hover:text-zinc-900"
            >
              {mode==='dark'
                ? <Sun size={18}/>
                : <Moon size={18}/>}
            </button>

            <NavLink
              to="/profile"
              aria-label="Perfil"
              className={({isActive})=>
                `hidden rounded-full p-2.5 transition md:block ${
                  isActive
                    ? 'text-white light:text-zinc-950'
                    : 'text-zinc-500 hover:bg-white/10 hover:text-white light:hover:bg-black/5 light:hover:text-zinc-900'
                }`
              }
            >
              <UserRound size={18}/>
            </NavLink>

            <button
              aria-label={open?'Fechar menu':'Abrir menu'}
              aria-expanded={open}
              onClick={()=>setOpen(!open)}
              className="rounded-full p-2.5 text-zinc-500 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              {open
                ? <X size={19}/>
                : <Menu size={19}/>}
            </button>
          </div>
        </div>

        {open&&(
          <div className="border-t border-white/10 bg-[#0b0b0c] px-5 py-5 light:border-black/10 light:bg-[#f6f6f3] md:hidden">
            <nav className="space-y-1">
              {links.map(([to,label,Icon])=>(
                <NavLink
                  key={to}
                  to={to}
                  onClick={()=>setOpen(false)}
                  className={({isActive})=>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      isActive
                        ? 'bg-white text-black light:bg-black light:text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white light:text-zinc-600 light:hover:bg-black/5 light:hover:text-zinc-900'
                    }`
                  }
                >
                  <Icon size={17}/>
                  {label}
                </NavLink>
              ))}

              <NavLink
                to="/profile"
                onClick={()=>setOpen(false)}
                className={({isActive})=>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-white text-black light:bg-black light:text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white light:text-zinc-600 light:hover:bg-black/5 light:hover:text-zinc-900'
                  }`
                }
              >
                <UserRound size={17}/>
                Perfil
              </NavLink>

              <button
                onClick={()=>{
                  toggleTheme();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white light:text-zinc-600 light:hover:bg-black/5 light:hover:text-zinc-900"
              >
                {mode==='dark'
                  ? <Sun size={17}/>
                  : <Moon size={17}/>}

                {mode==='dark'
                  ? 'Tema claro'
                  : 'Tema escuro'}
              </button>

              <button
                onClick={()=>{
                  nav('/search');
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white light:text-zinc-600 light:hover:bg-black/5 light:hover:text-zinc-900"
              >
                <Search size={17}/>
                Buscar
              </button>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet/>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 text-sm text-zinc-500 light:border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="font-semibold tracking-tight text-zinc-300 light:text-zinc-800">
            VIBES.
          </span>

          <span>
            Encontre algo que combine com você.
          </span>
        </div>
      </footer>
    </div>
  );
}