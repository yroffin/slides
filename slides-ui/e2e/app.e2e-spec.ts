import { AppPage } from './app.po';

describe('slides-ui App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    console.log(page.getParagraphText());
    expect(page.getParagraphText()).toEqual('teszaet - titleeazzea - tesazzaet');
  });
});
