import * as React from 'react';
import Head from 'next/head';
import { IFAQ } from '../../utils/api-return-types';
import { observer } from 'mobx-react';
import { Navigator } from '../../components/navigator/navigator';
import { apiFetch } from '../../utils/api-fetch';
import { PageTitle } from '../../components/page-title/page-title';
import { FAQCard } from '../../components/faq/faq-card';
import { GetServerSidePropsContext, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Scrollbars from "react-custom-scrollbars";
import Link from 'next/link';

@observer
class FAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public get renderFAQCards(): React.ReactNode {
    const faqs: Array<IFAQ> = this.props.faqs;
    if (faqs.length === 0) {
      return (
        <section className="loading-alert">
          Looks like we don't have any FAQs written yet ^_^"
        </section>
      );
    }

    return faqs.sort((a, b) => a.id - b.id).map(faq => (
      <Link key={faq.id} href={`/faq/${faq.id}`}>
        <a><FAQCard {...faq} /></a>
      </Link>
    ));
  }

  public get renderCardContent(): React.ReactNode {
    return (
      <section className="card-content-hint">
        <header className="place-holder-title">
          Open a FAQ Card to read its contents here!
        </header>
        <article className="place-holder-content" />
      </section>
    );
  }

  public render() {
    return (
      <section className="faq-container">
        <Head>
          <title>FAQ: Mealie.Moe</title>
        </Head>
        <aside className="faq-card-list">
          <Scrollbars universal>
            {this.renderFAQCards}
          </Scrollbars>
        </aside>
        <main className="faq-card-content">
          <PageTitle title="Frequently Asked Questions" />
          {this.renderCardContent}
          <Navigator />
        </main>
      </section>
    );
  }
}

export default FAQ;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const results = await apiFetch<Array<IFAQ>>("/faq", "GET");
  return {
    props: {
      faqs: results
    }, // will be passed to the page component as props
  };
}
