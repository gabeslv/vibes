export const energies = [
 {id:'low',label:'Baixa',icon:'○'}, {id:'calm',label:'Tranquila',icon:'◌'}, {id:'normal',label:'Normal',icon:'◒'}, {id:'high',label:'Alta',icon:'◉'}, {id:'explosive',label:'Explosiva',icon:'✦'}
];
export const moods = [
 {id:'happy',label:'Feliz',icon:'☀'}, {id:'melancholic',label:'Melancólico',icon:'☾'}, {id:'romantic',label:'Romântico',icon:'♡'}, {id:'confident',label:'Confiante',icon:'✦'}, {id:'nostalgic',label:'Nostálgico',icon:'↺'}, {id:'reflective',label:'Reflexivo',icon:'◐'}, {id:'anxious',label:'Ansioso',icon:'≈'}, {id:'fun',label:'Divertido',icon:'✷'}, {id:'calm',label:'Calmo',icon:'—'}
];
export const environments = [
 {id:'rain',label:'Chuva',icon:'☂'}, {id:'night',label:'Cidade à noite',icon:'◐'}, {id:'sunset',label:'Pôr do sol',icon:'◒'}, {id:'beach',label:'Praia',icon:'⌁'}, {id:'nature',label:'Natureza',icon:'⌁'}, {id:'home',label:'Em casa',icon:'□'}, {id:'road',label:'Na estrada',icon:'→'}, {id:'party',label:'Festa',icon:'✦'}
];
export const contentTypes = [{id:'movie',label:'Filme'},{id:'music',label:'Música'},{id:'both',label:'Filme + Música'}] as const;
export const moodConfig: Record<string,{movieGenres:number[]; musicTags:string[]}> = {
 happy:{movieGenres:[35,16,12],musicTags:['pop','happy','dance']}, melancholic:{movieGenres:[18,10749],musicTags:['indie','alternative','melancholic']}, romantic:{movieGenres:[10749,18],musicTags:['romance','rnb','soul']}, confident:{movieGenres:[28,80,12],musicTags:['hip-hop','rock','pop']}, nostalgic:{movieGenres:[18,35,10751],musicTags:['80s','90s','nostalgia']}, reflective:{movieGenres:[18,878],musicTags:['alternative','indie','ambient']}, anxious:{movieGenres:[53,18],musicTags:['ambient','alternative','electronic']}, fun:{movieGenres:[35,12,16],musicTags:['pop','dance','funk']}, calm:{movieGenres:[16,18,10751],musicTags:['acoustic','chillout','ambient']}
};
export const energyConfig: Record<string,{movieGenres:number[]; musicTags:string[]}> = { low:{movieGenres:[18,10749],musicTags:['acoustic','ambient']}, calm:{movieGenres:[18,16],musicTags:['chillout','ambient']}, normal:{movieGenres:[],musicTags:['pop']}, high:{movieGenres:[28,12,35],musicTags:['rock','pop','dance']}, explosive:{movieGenres:[28,12],musicTags:['rock','metal','dance']}};
export const environmentConfig: Record<string,{movieGenres:number[]; musicTags:string[]}> = {rain:{movieGenres:[18,10749],musicTags:['rain','indie']},night:{movieGenres:[80,9648,878],musicTags:['night','electronic','alternative']},sunset:{movieGenres:[10749,18],musicTags:['chillout','indie','acoustic']},beach:{movieGenres:[35,12],musicTags:['summer','pop','reggae']},nature:{movieGenres:[12,16],musicTags:['folk','acoustic','ambient']},home:{movieGenres:[35,18],musicTags:['lofi','chillout']},road:{movieGenres:[12,80],musicTags:['rock','roadtrip']},party:{movieGenres:[35,10402],musicTags:['dance','pop','house']}};
export function getVibeTitle(s:{mood:string;environment:string}) { const m=moods.find(x=>x.id===s.mood)?.label ?? 'Sua'; const e=environments.find(x=>x.id===s.environment)?.label ?? 'vibe'; return `${e} ${m}`; }
