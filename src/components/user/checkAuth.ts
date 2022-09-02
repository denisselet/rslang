export function checkAuth(): boolean {
  if (localStorage.getItem('user')) {
    return true;
  }
  return false;
}
