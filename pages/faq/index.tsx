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
import cookies from 'next-cookies';
import { DraggablePanel } from '../../components/panel-drag/draggable-panel';
import Constants from "../../utils/constants.json";

@observer
class FAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public get renderFAQCards(): React.ReactNode {
    const faqs: Array<IFAQ> = this.props.faqs;
    if (faqs.length === Constants.EMPTY_LENGHT) {
      return (
        <section className="loading-alert">
          Looks like we don&apos;t have any FAQs written yet ^_^&quot;
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

  public render(): React.ReactNode {
    return (
      <main className="faq-container">
        <Head>
          <title>FAQ: Mealie.Moe</title>
        </Head>
        <DraggablePanel className="faq-card-list">
          <section className="scroll-container">
            <Scrollbars universal>
              {this.renderFAQCards}
            </Scrollbars>
          </section>
        </DraggablePanel>
        <div className="faq-card-content">
          <PageTitle title="Frequently Asked Questions" />
          {this.renderCardContent}
          <Navigator loggedIn={Boolean(this.props.sessionToken)} />
        </div>
      </main>
    );
  }
}

export default FAQ;

export const getServerSideProps: GetServerSideProps<{
  faqs: Array<IFAQ>;
  sessionToken: string|null;
}> = async (context: GetServerSidePropsContext) => {
  const results = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const sessionToken = cookies(context)["session-jwt"] ?? null;
  return {
    props: {
      faqs: results,
      sessionToken
    }, // will be passed to the page component as props
  };
}
