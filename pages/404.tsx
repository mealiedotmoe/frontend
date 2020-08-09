import * as React from 'react';
import Link from 'next/link';
import { PageTitle } from '../components/page-title/page-title';

const NotFoundPage: React.FunctionComponent<{}> = ({ }): JSX.Element => (
  <main className="not-found-page">
    <article className="links">
      <PageTitle title="404 - Not Found" className="title" />
      <p>
        Looks like you have stumbled into a place which doesn't exist.
        Here's a list of places you can go to instead:
      </p>
      <ul>
        <li>
          <Link href="/">
            <a>Dashboard</a>
          </Link>
        </li>
        <li>
          <Link href="/pages">
            <a>Pages</a>
          </Link>
        </li>
        <li>
          <Link href="/faq">
            <a>Frequently Asked Questions</a>
          </Link>
        </li>
        <li>
          <Link href="/server-map">
            <a>Server Map</a>
          </Link>
        </li>
        <li>
          <a rel="nofollow noopener" target="_blank" href="https://www.danbo.space/leaderboards/148606162810568704">Leaderboards</a>
        </li>
      </ul>
    </article>
  </main>
);

export default NotFoundPage;