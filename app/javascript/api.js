export function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

export function fetchWithCsrf(url, options = {}) {
  const csrfToken = getCsrfToken();

  const headers = {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
    ...options.headers,
  };

  return fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });
}
