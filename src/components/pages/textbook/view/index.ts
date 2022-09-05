import { checkAuth } from '../../../user/checkAuth';
import './style.scss';

export class TextbookView {
  public draw(): void {
    const template = this.getTemplate();
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = '';
    content.insertAdjacentHTML('beforeend', template);
  }

  private getTemplate(): string {
    return `
<main class="block-textbook">
<p>Приступите к изучению слов выбрав раздел и страницу учебника.</p>
<section class="section-textbook-partition">
<p>Выберите раздел:</p>
<div class="wrapper-partition-btn">
<div class="form_radio_btn">
<input id="radio-partition-1" type="radio" name="partition" value="1">
<label for="radio-partition-1">Раздел 1</label>
</div>

<div class="form_radio_btn">
<input id="radio-partition-2" type="radio" name="partition" value="2">
<label for="radio-partition-2">Раздел 2</label>
</div>

<div class="form_radio_btn">
<input id="radio-partition-3" type="radio" name="partition" value="3">
<label for="radio-partition-3">Раздел 3</label>
</div>

<div class="form_radio_btn">
<input id="radio-partition-4" type="radio" name="partition" value="4">
<label for="radio-partition-4">Раздел 4</label>
</div>

<div class="form_radio_btn">
<input id="radio-partition-5" type="radio" name="partition" value="5">
<label for="radio-partition-5">Раздел 5</label>
</div>

<div class="form_radio_btn">
<input id="radio-partition-6" type="radio" name="partition" value="6">
<label for="radio-partition-6">Раздел 6</label>
</div>

<div class="form_radio_btn none" id="div-but-hard">
<input id="radio-partition-7" type="radio" name="partition" value="7">
<label for="radio-partition-7">Сложные слова</label>
</div>
</div>
</section>

<section class="section-textbook-pages">
<p>Выберите страницу:</p>
<div class="wrapper-pages-btn">
<div class="form_radio_btn">
<input id="radio-page-1" type="radio" name="page" value="1">
<label for="radio-page-1">Страница 1</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-2" type="radio" name="page" value="2">
<label for="radio-page-2">Страница 2</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-3" type="radio" name="page" value="3">
<label for="radio-page-3">Страница 3</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-4" type="radio" name="page" value="4">
<label for="radio-page-4">Страница 4</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-5" type="radio" name="page" value="5">
<label for="radio-page-5">Страница 5</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-6" type="radio" name="page" value="6">
<label for="radio-page-6">Страница 6</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-7" type="radio" name="page" value="7">
<label for="radio-page-7">Страница 7</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-8" type="radio" name="page" value="8">
<label for="radio-page-8">Страница 8</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-9" type="radio" name="page" value="9">
<label for="radio-page-9">Страница 9</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-10" type="radio" name="page" value="10">
<label for="radio-page-10">Страница 10</label>
</div>
<div class="form_radio_btn">
<input id="radio-page-11" type="radio" name="page" value="11">
<label for="radio-page-11">Страница 11</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-12" type="radio" name="page" value="12">
<label for="radio-page-12">Страница 12</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-13" type="radio" name="page" value="13">
<label for="radio-page-13">Страница 13</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-14" type="radio" name="page" value="14">
<label for="radio-page-14">Страница 14</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-15" type="radio" name="page" value="15">
<label for="radio-page-15">Страница 15</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-16" type="radio" name="page" value="16">
<label for="radio-page-16">Страница 16</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-17" type="radio" name="page" value="17">
<label for="radio-page-17">Страница 17</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-18" type="radio" name="page" value="18">
<label for="radio-page-18">Страница 18</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-19" type="radio" name="page" value="19">
<label for="radio-page-19">Страница 19</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-20" type="radio" name="page" value="20">
<label for="radio-page-20">Страница 20</label>
</div>
<div class="form_radio_btn">
<input id="radio-page-21" type="radio" name="page" value="21">
<label for="radio-page-21">Страница 21</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-22" type="radio" name="page" value="22">
<label for="radio-page-22">Страница 22</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-23" type="radio" name="page" value="23">
<label for="radio-page-23">Страница 23</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-24" type="radio" name="page" value="24">
<label for="radio-page-24">Страница 24</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-25" type="radio" name="page" value="25">
<label for="radio-page-25">Страница 25</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-26" type="radio" name="page" value="26">
<label for="radio-page-26">Страница 26</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-27" type="radio" name="page" value="27">
<label for="radio-page-27">Страница 27</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-28" type="radio" name="page" value="28">
<label for="radio-page-28">Страница 28</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-29" type="radio" name="page" value="29">
<label for="radio-page-29">Страница 29</label>
</div>

<div class="form_radio_btn">
<input id="radio-page-30" type="radio" name="page" value="30">
<label for="radio-page-30">Страница 30</label>
</div>
</div>
</section>

<section class="section-textbook-words">
<div class="wrapper-textbook-links${(checkAuth()) ? '' : ' none'}"></div>
<p>Слова для изучения:</p>
<div class="wrapper-textbook-words"></div>

</section>
</main>
`;
  }
}
