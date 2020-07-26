import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';
import { DecodedJWT, IFAQ } from '../../../utils/api-return-types';
import { redirectToLogin } from '../../../utils/login';
import { apiFetch } from '../../../utils/api-fetch';
import { FAQCard } from '../../../components/faq/faq-card';
import Link from 'next/link';
import Head from 'next/head';

class FAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public componentDidMount() {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return null;
    }
  }

  public render() {
    return (
      <main className="faq-admin-container">
        <Head>
          <title>
            Create FAQ: Admin - Mealie.Moe
          </title>
        </Head>
        <aside className="faq-card-list">
          <h1 className="title">Edit List</h1>
          <Link href="/admin/faq/create">
            <a>
              <FAQCard tag="" title="" color="" id={0} createNew />
            </a>
          </Link>
          {this.props.faqs.map(faq => (
            <Link href={`/admin/faq/edit/${faq.id}`} key={faq.id}>
              <a>
                <FAQCard {...faq} />
              </a>
            </Link>
          ))}
        </aside>
      </main>
    )
  }
}

export default FAQ;

export const getServerSideProps: GetServerSideProps<{
  isAdmin: boolean;
  faqs: Array<IFAQ>;
}> = async (context: GetServerSidePropsContext) => {
  const results = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const sessionToken = cookies(context)["session-jwt"] ?? null;
  if (sessionToken) {
    const { isAdmin, username, sub } = jwt.decode(sessionToken) as DecodedJWT;
    return {
      props: {
        isAdmin,
        faqs: results
      }
    };
  }
  return {
    props: {
      isAdmin: false,
      faqs: results
    }
  };
};
