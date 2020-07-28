import * as React from 'react';
import { Navigator } from '../components/navigator/navigator';
import { PageTitle } from '../components/page-title/page-title';
import Head from 'next/head';

 const MarkdownGuide: React.FunctionComponent<{}> = (): JSX.Element => (
   <main className="markdown-guide-container">
    <Head>
      <title>Markdown Guide: Mealie.Moe</title>
    </Head>
    <PageTitle title="Markdown Guide" /><div />
    <div className="name">Heading 1</div><div className="code">#</div>
    <div className="name">Heading 2</div><div className="code">##</div>
    <div className="name">Heading 3</div><div className="code">###</div>
    <div className="name">Heading 4</div><div className="code">####</div>
    <div className="name">Heading 5</div><div className="code">#####</div>
    <div className="name">Bold</div><div className="code">**<b>bold text</b>**</div>
    <div className="name">Italic</div><div className="code">**<i>italic text</i>**</div>
    <div className="name">Unordered List</div>
    <div className="code">
      - List Item 1
      <br />
      - List Item 2
      <br />
      - List Item 3
    </div>
    <div className="name">Ordered List</div>
    <div className="code">
      1. List Item 1
      <br />
      2. List Item 2
      <br />
      3. List Item 3
    </div>
    <div className="name">Code</div><div className="code">`code`</div>
    <div className="name">Block Code</div>
    <div className="code">
      ```
      <br />
      code machine() (
        <br />
        &nbsp;&nbsp;goes brrr...
        <br />
      )
      <br />
      ```
    </div>
    <div className="name">Link</div>
    <div className="code">
      [title](https://www.example.com)
      <br />
      <span className="hint">We will automatically make it so that the link opens in a new tab</span>
    </div>
    <div className="name">Image</div>
    <div className="code">
       ![alt text](https://wack.com/image.png)
    </div>
    <div className="end-gap" />
    <Navigator centered />
  </main>
)

export default MarkdownGuide;