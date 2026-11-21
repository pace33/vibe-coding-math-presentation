import {news} from '../server/news.mjs';
export function GET(request) { return news(request); }
export function OPTIONS(request) { return news(request); }
