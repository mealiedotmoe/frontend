import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { apiFetch } from '../../utils/api-fetch';
import { IFAQ, ISpecificFAQ, User } from '../../utils/api-return-types';
import Link from 'next/link';
import { FAQCard } from '../../components/faq/faq-card';
import Head from 'next/head';
import Scrollbars from 'react-custom-scrollbars';
import { PageTitle } from '../../components/page-title/page-title';
import { Navigator } from '../../components/navigator/navigator';
import Markdown from "react-markdown";
import Color from 'color';
import cookies from "next-cookies";

class FAQContent extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public get renderFAQCards(): React.ReactNode {
    const faqs: Array<IFAQ> = this.props.faqs;
    const selectedFAQ = this.props.faqContent;
    const nodes = [(
      <Link href={`/faq/${selectedFAQ.id}`} key={selectedFAQ.id}>
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
          <title>FAQ - {this.props.faqContent.tag}: Mealie.Moe</title>
        </Head>
        <aside className="faq-card-list">
          <Scrollbars universal>
            {this.renderFAQCards}
          </Scrollbars>
        </aside>
        <main className="faq-card-content">
          <PageTitle title={`${this.props.faqContent.title} - FAQ`} />
          <div
            className="faq-tag"
            style={{ background: this.props.faqContent.color, color: Color(this.props.faqContent.color).contrast(Color("#FFFFFF")) < 3 ? "#202020" : "#FFFFFF" }}
          >
            <span>{this.props.faqContent.tag}</span>
          </div>
          {this.renderCardContent}
          <Navigator loggedIn={this.props.loggedIn} />
        </main>
      </section>
    );
  }
}

export default FAQContent;

export const getServerSideProps: GetServerSideProps<{
  faqs: Array<IFAQ>;
  faqContent: ISpecificFAQ;
  author?: User;
  lastEditor?: User;
  loggedIn: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const { token } = cookies(context);
  const faqs = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const faqContent = await apiFetch<ISpecificFAQ>(`/faq/${context.params?.id}`, "GET");
  if (!token) {
    return {
      props: {
        faqs,
        faqContent,
        loggedIn: Boolean(token)
      }
    };
  }

  const author = await apiFetch<User>(`/user/${faqContent.author}`, "GET");
  const lastEditor = faqContent.last_edit === faqContent.author ? author : await apiFetch<User>(`/user/${faqContent.last_edit}`, "GET");
  return {
    props: {
      faqs,
      faqContent,
      author,
      lastEditor,
      loggedIn: Boolean(token)
    },
  };
}
