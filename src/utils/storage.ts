export function read<T>(key:string,fallback:T):T{try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch{return fallback}}
export function write<T>(key:string,value:T){localStorage.setItem(key,JSON.stringify(value))}
export function remove(key:string){localStorage.removeItem(key)}
