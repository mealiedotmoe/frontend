import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';
import { DecodedJWT } from '../../utils/api-return-types';
import { redirectToLogin } from '../../utils/login';
import Head from 'next/head';
import Link from 'next/link';
import { MdAccountCircle, MdSchool, MdPages } from "react-icons/md";

class AdminHome extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public componentDidMount() {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return null;
    }
  }

  public render() {
    return (
      <main className="admin-home">
        <Head>
          <title>
            Mealie.Moe: Admin Dashboard
          </title>
        </Head>
        <section className="hero">
          <section className="hero-text">
            <h1 className="title">
              Mealie.moe
            </h1>
            <h2 className="subtitle">
              But, the admin side of things.
            </h2>
            <p className="description">
              And without the fancy pants but unused features now.
            </p>
          </section>
        </section>
        <aside className="link-container">
          <section className="links">
            <Link href="/admin/users">
              <a className="link">
                <MdAccountCircle className="icon" />
                Users
              </a>
            </Link>
            <Link href="/admin/faq/create">
              <a className="link">
                <MdSchool className="icon" />
                Edit FAQs
              </a>
            </Link>
            <Link href="/admin/pages/create">
              <a className="link">
                <MdPages className="icon" />
                Edit Pages
              </a>
            </Link>
          </section>
        </aside>
      </main>
    );
  }
}

export default AdminHome;

export const getServerSideProps: GetServerSideProps<{
  isAdmin: boolean;
  username: string|null;
  sub: string|null;
}> = async (context: GetServerSidePropsContext) => {
  const sessionToken = cookies(context)["session-jwt"] ?? null;
  if (sessionToken) {
    const { isAdmin, username, sub } = jwt.decode(sessionToken) as DecodedJWT;
    return {
      props: {
        isAdmin,
        username,
        sub
      }
    };
  }
  return {
    props: {
      isAdmin: false,
      username: null,
      sub: null
    }
  };
};