import type {Config} from "tailwindcss";
const config:Config={content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],theme:{extend:{colors:{night:"#111820",signal:"#a3ed75"}}},plugins:[]};
export default config;