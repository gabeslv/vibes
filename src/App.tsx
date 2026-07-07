import {Routes,Route} from 'react-router-dom';

import {Layout} from './components/Layout';

import {Home} from './pages/Home';
import {Vibe} from './pages/Vibe';
import {Discover} from './pages/Discover';
import {Movies} from './pages/Movies';
import {MovieDetails} from './pages/MovieDetails';
import {Music} from './pages/Music';
import {Search} from './pages/Search';
import {Favorites} from './pages/Favorites';
import {History} from './pages/History';
import {Profile} from './pages/Profile';
import {Settings} from './pages/Settings';

export default function App(){
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/vibe" element={<Vibe/>}/>
        <Route path="/discover" element={<Discover/>}/>
        <Route path="/movies" element={<Movies/>}/>
        <Route path="/movies/:id" element={<MovieDetails/>}/>
        <Route path="/music" element={<Music/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Route>
    </Routes>
  );
}