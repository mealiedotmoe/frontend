import * as React from 'react';
import { InfoPage } from '../../../utils/api-return-types';
import { GetServerSidePropsContext, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import { apiFetch } from '../../../utils/api-fetch';
import { PageTitle } from '../../../components/page-title/page-title';
import { PageCard } from '../../../components/page-card/page-card';
import { Navigator } from '../../../components/navigator/navigator';
import Head from 'next/head';

class Pages extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public render(): React.ReactNode {
    return (
      <main className="pages-container">
        <Head>
          <title>Info Pages: Mealie.Moe</title>
        </Head>
        <main className="content-container">
          <PageTitle title="Info Pages: Admin" />
          {this.props.pages.map(page => <PageCard page={page} admin key={page.slug} />)}
        </main>
        <Navigator admin centered loggedIn={this.props.loggedIn} />
      </main>
    )
  }
}

export default Pages;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
  pages: Array<InfoPage>
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  const pages = await apiFetch<Array<InfoPage>>("/info", "GET");

  return {
    props: {
      loggedIn: Boolean(token),
      pages
    }
  };
};