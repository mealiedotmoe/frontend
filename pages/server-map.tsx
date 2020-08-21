import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import { Navigator } from '../components/navigator/navigator';
import Head from 'next/head';

export default class ServerMap extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public render(): React.ReactNode {
    return (
      <section className="server-map-container">
        <Head>
          <title>
            Server Map: Mealie.Moe
          </title>
        </Head>
        <iframe src="https://www.google.com/maps/d/embed?mid=1O6iZDvlEZTNpCBFqLmHSG-wVvO6GVMMB" className="embed" />
        <Navigator centered loggedIn={this.props.loggedIn} />
      </section>
    )
  }
}

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  if (!token) {
    return {
      props: {
        loggedIn: Boolean(token),
      }
    };
  }

  return {
    props: {
      loggedIn: Boolean(token)
    },
  };
}
