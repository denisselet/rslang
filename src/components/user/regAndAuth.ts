import SignInService from '../services/signIn-service';
import UsersService from '../services/users-service';

export async function registration() {
  document.querySelector('#but_reg').addEventListener('click', async () => {
    const emailReg = (document.querySelector('#email_reg') as HTMLInputElement).value;
    const passReg = (document.querySelector('#pass_reg') as HTMLInputElement).value;
    const nameReg = (document.querySelector('#name_reg') as HTMLInputElement).value;
    const response = await UsersService.createNewUser({
      name: String(nameReg),
      email: String(emailReg),
      password: String(passReg)
    });
    if (response.name) return 'Registered';

    alert('Incorrect email and password');
    return 'No registered';
  });
}

export async function authorization() {
  document.querySelector('#but_auth').addEventListener('click', async () => {
    const emailAuth = (document.querySelector('#email_auth') as HTMLInputElement).value;
    const passAuth = (document.querySelector('#pass_auth') as HTMLInputElement).value;
    const response = await SignInService.userLogin({
      email: String(emailAuth),
      password: String(passAuth)
    });
    alert(response);

    if (response === 'Not Found') {
      alert('Incorrect email and password');
    }
    return response;
  });
}
