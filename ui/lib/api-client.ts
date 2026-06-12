import axios from 'axios';

function resolveBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }
  return 'http://localhost:3000';
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});
