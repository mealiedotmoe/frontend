export function redirectToLogin(): void {
  window.localStorage.setItem("callback-to", window.location.pathname);
  window.location.pathname = "/login-redirect";
}