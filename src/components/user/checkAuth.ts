export function checkAuth() {
  if (localStorage.getItem('user')) {
    return true;
  }
  return false;
}
