import { ScaffoldingAllPage } from './app.po';

describe('scaffolding-all App', function() {
  let page: ScaffoldingAllPage;

  beforeEach(() => {
    page = new ScaffoldingAllPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
