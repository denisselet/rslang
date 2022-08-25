// TODO: add assets as img
import './style.scss';

export class FooterView {
  public draw(): void {
    const template = this.getTemplate();
    const { body } = document;

    body.insertAdjacentHTML('beforeend', template);
  }

  private getTemplate(): string {
    return `<footer>
                <div>
                    <a href="https://rs.school/js/"><img class="rs-logo" src="./assets/img/rs.svg" alt="logo-rs"></a>
                </div>

                <div class="footer-link-gh">
                    <a href="https://github.com/denisselet">denisselet</a>
                    <a href="https://github.com/lapkot">lapkot</a>
                    <a href="https://github.com/Evgeniy652">Evgeniy652</a>
                </div>

                <div>
                    © 2022
                </div>
            </footer>`;
  }
}
