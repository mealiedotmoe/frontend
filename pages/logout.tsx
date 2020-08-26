import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Constants from '../utils/constants.json';

export default class Logout extends React.Component<Record<string, unknown>> {
  public componentDidMount(): void {
    setTimeout(() => window.location.pathname = "/", Constants.INTERNAL_REDIRECT_TIMEOUT * Constants.SECONDS_TO_MILLISECONDS_FACTOR);
  }
  
  public render(): React.ReactNode {
    return (
      <section className="logout-container">
        Logging you out, give us a second...
      </section>
    )
  }
}

export const getServerSideProps: GetServerSideProps<Record<string, unknown>> = async (context: GetServerSidePropsContext) => {
  context.res.setHeader("Set-Cookie", "session-jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
  return {
    props: {}
  };
}
