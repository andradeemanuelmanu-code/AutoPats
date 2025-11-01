import axios from 'axios';

const apiKey = import.meta.env.VITE_ORS_API_KEY;

export const orsApi = axios.create({
  baseURL: '/ors-api',
  headers: {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Authorization': apiKey,
    'Content-Type': 'application/json; charset=utf-8'
  }
});