import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { apiFetch } from '../../utils/api-fetch';
import { IFAQ, ISpecificFAQ, User, DecodedJWT } from '../../utils/api-return-types';
import Link from 'next/link';
import { FAQCard } from '../../components/faq/faq-card';
import Head from 'next/head';
import Scrollbars from 'react-custom-scrollbars';
import { PageTitle } from '../../components/page-title/page-title';
import { Navigator } from '../../components/navigator/navigator';
import Markdown from "react-markdown";
import Color from 'color';
import cookies from "next-cookies";
import jwt from "jsonwebtoken";
import { DraggablePanel } from '../../components/panel-drag/draggable-panel';
import Constants from "../../utils/constants.json";

class FAQContent extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  public get renderFAQCards(): React.ReactNode {
    const faqs: Array<IFAQ> = this.props.faqs;
    
    return faqs.sort((a, b) => a.id - b.id).map(faq => (
      <Link href={`/faq/${faq.id}`} key={faq.id}>
        <a><FAQCard {...faq} selected={faq.id === this.props.faqContent.id} /></a>
      </Link>
    ));
  }

  public get renderCardContent(): React.ReactNode {
    const faq = this.props.faqContent as ISpecificFAQ;
    return (
      <section style={{ marginTop: 24 }}>
        <Markdown
          source={faq.content}
          className="markdown-content"
          renderers={{ link: props => <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a> }}
        />
      </section>
    )
  }

  public render(): React.ReactNode {
    return (
      <main className="faq-container">
        <Head>
          <title>FAQ - {this.props.faqContent.tag}: Mealie.Moe</title>
        </Head>
        <DraggablePanel className="faq-card-list">
          <section className="scroll-container">
            <Scrollbars universal>
              {this.renderFAQCards}
            </Scrollbars>
          </section>
        </DraggablePanel>
        <section className="faq-card-content">
          <PageTitle title={`${this.props.faqContent.title} - FAQ`} />
          <section className="tags-container">
            <div
              className="faq-tag"
              style={{
                background: this.props.faqContent.color,
                color: Color(this.props.faqContent.color).contrast(Color("#FFFFFF")) < Constants.FAQ_TAGS_MIN_CONTRAST ? "#202020" : "#FFFFFF"
              }}
            >
              <span>{this.props.faqContent.tag}</span>
            </div>
            {this.props.isAdmin && (
              <>
                <Link href={`/admin/faq/edit/${this.props.faqContent.id}`}>
                  <a>Edit FAQ</a>
                </Link>
                <span className="text-hint">This link is only visible to admins</span>
              </>
            )}
          </section>
          {this.renderCardContent}
          <Navigator loggedIn={this.props.loggedIn} />
        </section>
      </main>
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
  isAdmin: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  const faqs = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const faqContent = await apiFetch<ISpecificFAQ>(`/faq/${context.params?.id}`, "GET");
  if (!token) {
    return {
      props: {
        faqs,
        faqContent,
        loggedIn: Boolean(token),
        isAdmin: false
      }
    };
  }

  const { isAdmin } = jwt.decode(token) as DecodedJWT;
  return {
    props: {
      faqs,
      faqContent,
      loggedIn: Boolean(token),
      isAdmin
    },
  };
}
