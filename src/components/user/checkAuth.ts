import UsersService from '../services/users-service';

export function checkAuth() {
  if (localStorage.getItem('user')) {
    if ((+localStorage.getItem('dateTimeAuth') + 14400000) < new Date().getTime()) {
      changeToken();
    }
    return true;
  }
  return false;
}

export async function changeToken() {
  console.log('changeToken after 4 hour');
  const userObj = JSON.parse(localStorage.getItem('user'));
  userObj.token = String(userObj.refreshToken);
  localStorage.setItem('user', JSON.stringify(userObj));
  const response = await UsersService.getNewUserTokens();
  userObj.token = response.token;
  userObj.refreshToken = response.refreshToken;
  localStorage.setItem('user', JSON.stringify(userObj));
  localStorage.setItem('dateTimeAuth', JSON.stringify(new Date().getTime()));
}
