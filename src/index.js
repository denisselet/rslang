window.onload = function () {

	/* start login form functionality */
	const login = document.getElementById('login');
	const flip = document.querySelector('.flip');
	const accountBlock = document.querySelector('.account-block');

	accountBlock.addEventListener('click', (event) => {
		login.classList.toggle('login-visible');
	})

	login.addEventListener('click', (event) => {
		if(event.target.className === 'button-cancel-form') {
			login.classList.remove('login-visible');
		}

		if(event.target.className === 'flipper') {
			flip.classList.toggle('flipped');
		}
	})
	/*end login form functionality */

}