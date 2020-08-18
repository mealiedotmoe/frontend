import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export default class Logout extends React.Component<{}> {
  public componentDidMount(): void {
    setTimeout(() => window.location.pathname = "/", 500);
  }
  
  public render() {
    return (
      <section className="logout-container">
        Logging you out, give us a second...
      </section>
    )
  }
}

export const getServerSideProps: GetServerSideProps<{}> = async (context: GetServerSidePropsContext) => {
  context.res.setHeader("Set-Cookie", "session-jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
  return {
    props: {}
  };
}
