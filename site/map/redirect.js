import {mapRedirectTarget} from './legacy-route.js';
location.replace(mapRedirectTarget(new URL(location.href)));
