import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { apiFetch } from '../../utils/api-fetch';
import { IFAQ, ISpecificFAQ } from '../../utils/api-return-types';
import Link from 'next/link';
import { FAQCard } from '../../components/faq/faq-card';
import Head from 'next/head';
import Scrollbars from 'react-custom-scrollbars';
import { PageTitle } from '../../components/page-title/page-title';
import { Navigator } from '../../components/navigator/navigator';
import Markdown from "react-markdown";
import Color from 'color';

class FAQContent extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public get renderFAQCards(): React.ReactNode {
    const faqs: Array<IFAQ> = this.props.faqs;
    const selectedFAQ = this.props.faqContent as ISpecificFAQ;
    const nodes = [(
      <Link href={`/faq/${selectedFAQ.id}`}>
        <a><FAQCard {...selectedFAQ} selected={selectedFAQ.id === this.props.faqContent.id} /></a>
      </Link>
    )];

    nodes.push(...faqs.filter(faq => faq.id !== selectedFAQ.id).sort((a, b) => a.id - b.id).map(faq => (
      <Link href={`/faq/${faq.id}`} key={faq.id}>
        <a><FAQCard {...faq} selected={faq.id === this.props.faqContent.id} /></a>
      </Link>
    )));
    return nodes;
  }

  public get renderCardContent(): React.ReactNode {
    const faq = this.props.faqContent as ISpecificFAQ;
    return (
      <section style={{ marginTop: 24 }}>
        <Markdown source={faq.content} className="markdown-content" />
      </section>
    )
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
          <PageTitle title={`${this.props.faqContent.title} - FAQ`} />
          <div className="faq-tag" style={{ background: this.props.faqContent.color, color: Color(this.props.faqContent.color).contrast(Color("#FFFFFF")) < 3 ? "#202020" : "#FFFFFF" }}>
            <span>{this.props.faqContent.tag}</span>
          </div>
          {this.renderCardContent}
          <Navigator />
        </main>
      </section>
    );
  }
}

export default FAQContent;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const faqs = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const faqContent = await apiFetch<ISpecificFAQ>(`/faq/${context.params?.id}`, "GET");

  return {
    props: {
      faqs,
      faqContent
    },
  };
}
