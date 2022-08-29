import SignInService from '../services/signIn-service';
import UsersService from '../services/users-service';

export async function registration() {
  document.querySelector('#but_reg').addEventListener('click', async (event) => {
    event.preventDefault();
    const emailReg = (document.querySelector('#email_reg') as HTMLInputElement).value;
    const passReg = (document.querySelector('#pass_reg') as HTMLInputElement).value;
    const nameReg = (document.querySelector('#name_reg') as HTMLInputElement).value;
    const response = await UsersService.createNewUser({
      name: String(nameReg),
      email: String(emailReg),
      password: String(passReg)
    });
    if (response.name) {
      document.querySelector<HTMLElement>('.flip').classList.toggle('flipped');
    } else {
      alert('Incorrect email and password');
    }
  });
}

export async function authorization() {
  document.querySelector('#but_auth').addEventListener('click', async (event) => {
    event.preventDefault();
    const emailAuth = (document.querySelector('#email_auth') as HTMLInputElement).value;
    const passAuth = (document.querySelector('#pass_auth') as HTMLInputElement).value;
    const response = await SignInService.userLogin({
      email: String(emailAuth),
      password: String(passAuth)
    });
    if (response === 'Not Found') {
      alert('Incorrect email and password');
    } else {
      document.getElementById('login').classList.remove('login-visible');
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}
