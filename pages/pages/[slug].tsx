import * as React from 'react';
import { PageTitle } from '../../components/page-title/page-title';
import { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from 'next';
import cookies from 'next-cookies';
import { Navigator } from '../../components/navigator/navigator';
import { apiFetch } from '../../utils/api-fetch';
import { InfoPage, DecodedJWT } from '../../utils/api-return-types';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import { UserDisplay } from '../../components/user-display/user-display';
import ReactTooltip from 'react-tooltip';
import jwt from 'jsonwebtoken';
import Link from 'next/link';

class SlugPage extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public render(): React.ReactNode {
    return (
      <main className="page-view-container">
        <Head>
          <title>{this.props.page.title}: Mealie.Moe</title>
        </Head>
        <article className="content-container">
          <PageTitle title={this.props.page.title} />
          <section className="meta">
            <div>
              ~{Math.ceil(this.props.page.content.split(" ").length / 200)} min read
            </div>
            <div className="date" data-tip data-for="last-edit">
              {(new Date(this.props.page.created_at)).toLocaleDateString()}
            </div>
            <ReactTooltip type="light" id="last-edit" effect="solid" place="top">
              Last Edit:&nbsp;&nbsp;&nbsp; {(new Date(this.props.page.updated_at)).toLocaleString()}
              <br />
              Created At: {(new Date(this.props.page.created_at)).toLocaleString()}
            </ReactTooltip>
            <UserDisplay user={this.props.page.author} className="username" append="By " />
            {this.props.isAdmin && (
              <Link href={`/admin/pages/edit/${this.props.page.slug}`}>
                <a title="Only admins can see this link">Edit</a>
              </Link>
            )}
          </section>
          <ReactMarkdown source={this.props.page.content} className="markdown-content" />
        </article>
        <Navigator centered loggedIn={this.props.loggedIn} />
      </main>
    )
  }
}

export default SlugPage;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
  page: InfoPage;
  isAdmin: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  const page = await apiFetch<InfoPage>(`/info/${context.params?.slug}`, "GET");
  if (token) {
    const { isAdmin } = jwt.decode(token) as DecodedJWT;
    return {
      props: {
        loggedIn: true,
        page,
        isAdmin
      }
    };
  }

  return {
    props: {
      loggedIn: false,
      page,
      isAdmin: false
    }
  }
};