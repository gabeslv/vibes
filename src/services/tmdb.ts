import type { Movie } from '../types';
const key=import.meta.env.VITE_TMDB_API_KEY as string|undefined;
console.log('TMDB KEY:', key ? 'OK' : 'NÃO ENCONTRADA');
const base='https://api.themoviedb.org/3';
const img=(p:string|null,size='w500')=>p?`https://image.tmdb.org/t/p/${size}${p}`:'';
async function request<T>(path:string, params:Record<string,string|number|undefined>={}){ if(!key) throw new Error('TMDB_API_KEY_MISSING'); const qs=new URLSearchParams({api_key:key,language:'pt-BR',include_adult:'false',...Object.fromEntries(Object.entries(params).filter(([,v])=>v!==undefined).map(([k,v])=>[k,String(v)]))}); const r=await fetch(`${base}${path}?${qs}`); if(!r.ok) throw new Error(`TMDB_${r.status}`); return r.json() as Promise<T>; }
export const tmdb={
 async discover(genres:number[]=[]){ const data=await request<{results:Movie[]}>('/discover/movie',{sort_by:'popularity.desc',with_genres:genres.slice(0,4).join('|')||undefined,vote_count_gte:150,page:Math.floor(Math.random()*3)+1}); return data.results.map(m=>({...m,poster_path:img(m.poster_path),backdrop_path:img(m.backdrop_path,'w1280')})); },
 async popular(){ const data=await request<{results:Movie[]}>('/movie/popular',{page:1}); return data.results.map(m=>({...m,poster_path:img(m.poster_path),backdrop_path:img(m.backdrop_path,'w1280')})); },
 async search(query:string){ const data=await request<{results:Movie[]}>('/search/movie',{query,page:1}); return data.results.map(m=>({...m,poster_path:img(m.poster_path),backdrop_path:img(m.backdrop_path,'w1280')})); },
 async details(id:number){ const m=await request<Movie & {runtime:number;genres:{id:number;name:string}[]}>(`/movie/${id}`,{}); return {...m,poster_path:img(m.poster_path),backdrop_path:img(m.backdrop_path,'w1280')}; }
};
