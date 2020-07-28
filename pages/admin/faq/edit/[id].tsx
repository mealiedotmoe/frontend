import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';
import { DecodedJWT, IFAQ, ISpecificFAQ } from '../../../../utils/api-return-types';
import { redirectToLogin } from '../../../../utils/login';
import { apiFetch } from '../../../../utils/api-fetch';
import { PageTitle } from '../../../../components/page-title/page-title';
import Link from 'next/link';
import { FAQCard } from '../../../../components/faq/faq-card';
import Color from 'color';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { ChromePicker } from "react-color";
import Head from 'next/head';
import Router from 'next/router';

@observer
class EditFAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private faqContent: { content: string } = {
    content: ""
  };
  @observable private textAreaRef: React.RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();
  @observable private tag: string = "";
  @observable private color: string = "#FFFFFF";
  @observable private displayColorPicker: boolean = false;

  public componentDidMount() {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return null;
    }
    this.faqContent.content = this.props.currentFAQ.content;
    this.color = this.props.currentFAQ.color;
    this.tag = this.props.currentFAQ.tag;
  }

  @computed public get renderEditor(): React.ReactNode {
    return (
      <form className="editor-container" onSubmit={ev => { ev.preventDefault(); this.save(); }}>
        <textarea
          value={this.faqContent.content}
          className="editor" onChange={ev => this.faqContent.content = ev.target.value}
          ref={this.textAreaRef}
          style={{
            minHeight: 500,
          }}
        />
        <section className="actions">
          <Link href="/markdown-guide">
            <a className="link" target="__blank">Markdown guide</a>
          </Link>
          <div className="flex-grow" />
          <button className="button text">
            Preview
          </button>
          <button className="button" type="submit">
            Save FAQ
          </button>
        </section>
      </form>
    );
  }

  private async save(): Promise<void> {
    const response = await apiFetch<ISpecificFAQ>(`/faq/${this.props.currentFAQ.id}`, "PUT", {
      title: this.props.currentFAQ.title,
      content: this.faqContent.content,
      tag: this.tag,
      color: this.color
    });
    Router.push(`/faq/${response.id}`);
  }

  public render() {
    return (
      <main className="faq-admin-container">
        <Head>
          <title>
            Editing: {this.props.currentFAQ.title}; Mealie.Moe - Admin
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
                <FAQCard {...faq} selected={this.props.currentFAQ.id === faq.id} />
              </a>
            </Link>
          ))}
        </aside>
        <section className="faq-card-content">
          <PageTitle title={`Editing: ${this.props.currentFAQ.title}`} />
          <section className="tag-control">
            <div
              className="faq-tag"
              style={{ background: this.color, color: Color(this.color).contrast(Color("#FFFFFF")) < 3 ? "#202020" : "#FFFFFF" }}
            >
              <input className="tag-input" value={this.tag} onChange={ev => this.tag = ev.target.value} />
            </div>
            <section className="change-color-control" onClick={() => this.displayColorPicker = true}>
              <span>
                Change Color
              </span>
            </section>
            {this.displayColorPicker && (
              <section className="popover">
                <div className="backdrop" onClick={() => this.displayColorPicker = false} />
                <ChromePicker color={this.color} onChange={ev => this.color = ev.hex} />
              </section>
            )}
          </section>
          {this.renderEditor}
        </section>
      </main>
    )
  }
}

export default EditFAQ;

export const getServerSideProps: GetServerSideProps<{
  isAdmin: boolean;
  faqs: Array<IFAQ>;
  currentFAQ: ISpecificFAQ;
}> = async (context: GetServerSidePropsContext) => {
  const results = await apiFetch<Array<IFAQ>>("/faq", "GET");
  const sessionToken = cookies(context)["session-jwt"] ?? null;
  const faqID = context.params?.id as string | undefined;
  const currentFAQ = await apiFetch<ISpecificFAQ>(`/faq/${faqID}`, "GET");

  if (sessionToken) {
    const { isAdmin, username, sub } = jwt.decode(sessionToken) as DecodedJWT;
    return {
      props: {
        isAdmin,
        faqs: results,
        currentFAQ
      }
    };
  }
  return {
    props: {
      isAdmin: false,
      faqs: results,
      currentFAQ
    }
  };
};
