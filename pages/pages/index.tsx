import * as React from 'react';
import { InfoPage } from '../../utils/api-return-types';
import { GetServerSidePropsContext, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import { apiFetch } from '../../utils/api-fetch';
import { PageTitle } from '../../components/page-title/page-title';

class Pages extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public render() {
    return (
      <main className="pages-container">
        <main className="content-container">
          <PageTitle title="Info Pages" />
        </main>
      </main>
    )
  }
}

export default Pages;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];

  return {
    props: {
      loggedIn: Boolean(token),
    }
  };
};