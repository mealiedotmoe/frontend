import * as React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import cookies from "next-cookies";
import jwt from 'jsonwebtoken';
import { DecodedJWT } from '../utils/api-return-types';
import Router from "next/router";

class Callback extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public componentDidMount() {
    const backTo = window.localStorage.getItem("callback-to");
    if (backTo) {
      // Clear the state
      window.localStorage.removeItem("callback-to");
      Router.push(backTo);
      return;
    }
    console.log("Oops...", backTo);
  }
  
  public render() {
    return (
      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        height: "100vh",
        fontSize: 48
      }}>
        <Head>
          <title>Logging in: Mealie.Moe</title>
        </Head>
        Hey there {this.props.username}
        Finalizing a couple things, just a second...
      </main>
    );
  }
}

export default Callback;

export const getServerSideProps: GetServerSideProps<{
  username: string | null;
}> = async (context: GetServerSidePropsContext) => {
  const sessionJWT = cookies(context)["session-jwt"];
  if (!sessionJWT) {
    return {
      props: {
        username: null
      }
    };
  }
  const { username } = jwt.decode(sessionJWT) as DecodedJWT;
  return {
    props: {
      username
    }
  };
}