import * as jwt from 'jsonwebtoken';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import Head from 'next/head';
import * as React from 'react';

import { Navigator } from '../../../components/navigator/navigator';
import { PageCard } from '../../../components/page-card/page-card';
import { PageTitle } from '../../../components/page-title/page-title';
import { apiFetch } from '../../../utils/api-fetch';
import { DecodedJWT, InfoPage } from '../../../utils/api-return-types';
import { redirectToLogin } from '../../../utils/login';

class Pages extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public componentDidMount(): void {
    if (!this.props.loggedIn) {
      redirectToLogin();
      return;
    }
  }

  private get nonAdminPage(): React.ReactNode {
    return (
      <main className="pages-container">
        <Head>
          <title>Info Pages: Mealie.Moe</title>
        </Head>
        <section className="content-container">
          <section className="non-admin-notice">
            <img src="/images/undraw_notify.svg" className="illustration" />
            <span className="not-allowed-hint">
              Seems like you are not allowed to view this page 😳
            </span>
          </section>
        </section>
      </main>
    )
  }

  public render(): React.ReactNode {
    if (!this.props.isAdmin) {
      return this.nonAdminPage;
    }
    
    return (
      <main className="pages-container">
        <Head>
          <title>Info Pages: Mealie.Moe</title>
        </Head>
        <section className="content-container">
          <PageTitle title="Info Pages: Admin" />
          {this.props.pages.map(page => <PageCard page={page} admin key={page.slug} />)}
        </section>
        <Navigator admin centered loggedIn={this.props.loggedIn} />
      </main>
    )
  }
}

export default Pages;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
  pages: Array<InfoPage>;
  isAdmin: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'] ?? null;
  try {
    const pages = await apiFetch<Array<InfoPage>>("/info/all", "GET");
    if (token) {
      const { isAdmin } = jwt.decode(token) as DecodedJWT;
      return {
        props: {
          loggedIn: Boolean(token),
          isAdmin,
          pages
        }
      }
    }

    return {
      props: {
        loggedIn: Boolean(token),
        pages,
        isAdmin: false
      }
    };
  } catch (e) {
    return {
      props: {
        loggedIn: false,
        pages: [],
        isAdmin: false
      }
    }
  }
  };
