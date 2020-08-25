import * as React from 'react';
import { InfoPage } from '../../utils/api-return-types';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';
import { UserDisplay } from '../user-display/user-display';

export interface PageCardProps {
  page: InfoPage;
  admin?: boolean;
}

export const PageCard: React.FunctionComponent<PageCardProps> = ({ page, admin }: PageCardProps): JSX.Element => (
  <Link href={`${admin ? "/admin/" : ""}pages/${admin ? "edit/" : ""}${page.slug}`}>
    <a>
      <article className="page-card">
        <header className="title">
          {page.title}
        </header>
        <section className="meta">
          <div className="created-at-time" data-tip data-for={`date-tooltip-${page.slug}`}>
            {(new Date(page.created_at)).toLocaleDateString()}
          </div>
          <ReactTooltip type="light" id={`date-tooltip-${page.slug}`} effect="solid" place="bottom">
            Last Edit:&nbsp;&nbsp;&nbsp; {(new Date(page.updated_at)).toLocaleString()}
            <br />
            Created At: {(new Date(page.created_at)).toLocaleString()}
          </ReactTooltip>
          <UserDisplay user={page.author} append="By " className="author" />
        </section>
      </article>
    </a>
  </Link>
)