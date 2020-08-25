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
import { PageTitle } from '../../../components/page-title/page-title';
import Color from 'color';
import { observable, computed } from 'mobx';
import { ChromePicker } from 'react-color';
import { observer } from 'mobx-react';
import Router from "next/router";
import { Alert } from '../../../components/alert/alert';
import { Navigator } from '../../../components/navigator/navigator';
import ReactMarkdown from 'react-markdown';
import { DraggablePanel } from '../../../components/panel-drag/draggable-panel';

@observer
class FAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private color = "#ffffff";
  @observable private tag = "FAQ Tag";
  @observable private displayColorPicker = false;
  @observable private title = "";
  @observable private content = "";
  @observable private error?: string;
  @observable private renderContentPreview = false;
  @observable private submitting = false;

  public componentDidMount(): void {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return;
    }
  }

  private async saveFAQ(ev: React.FormEvent<HTMLFormElement>): Promise<void> {
    ev.preventDefault();

    this.error = undefined;
    if (this.tag.trim().length === 0) {
      this.error = "Tag cannot be empty";
      return;
    }
    if (this.title.trim().length === 0) {
      this.error = "Title cannot be empty";
      return;
    }
    if (this.content.trim().length === 0) {
      this.error = "Content cannot be empty";
      return;
    }
    this.submitting = true;
    const response = await apiFetch<IFAQ>("/faq", "POST", {
      tag: this.tag,
      color: this.color,
      title: this.title,
      content: this.content,
    });
    const createdFAQId = response.id;
    Router.push(`/faq/${createdFAQId}`);
    this.submitting = false;
  }

  @computed private get renderContent(): React.ReactNode {
    if (this.renderContentPreview) return (
      <main className="rendered-content-container">
        <ReactMarkdown source={this.content} className="markdown-content" />
        <button type="button" className="button text" onClick={() => this.renderContentPreview = false}>
          Close Preview
        </button>
      </main>
    );
    
    return (
      <section className="editor-container">
        <textarea
          className="editor"
          style={{ minHeight: 400 }}
          placeholder="FAQ Content (markdown is supported)"
          value={this.content}
          onChange={ev => this.content = ev.target.value}
        />
        {this.error && (
          <Alert message={this.error} />
        )}
        <section className="actions">
          <Link href="/markdown-guide">
            <a className="link" target="__blank">Markdown guide</a>
          </Link>
          <div className="flex-grow" />
          <button className="button text" type="button" onClick={() => this.renderContentPreview = true}>
            Preview
          </button>
          <button type="submit" className="button" disabled={this.submitting}>
            {this.submitting ? "Saving" : "Save"}
          </button>
        </section>
      </section>
    );
  }

  public render(): React.ReactNode {
    return (
      <main className="faq-admin-container">
        <Head>
          <title>
            Create FAQ: Admin - Mealie.Moe
          </title>
        </Head>
        <DraggablePanel className="faq-card-list">
          <section className="scroll-container">
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
          </section>
        </DraggablePanel>
        <main className="faq-card-content">
          <PageTitle title="Create: FAQ" />
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
          <form onSubmit={ev => this.saveFAQ(ev)}>
            <input className="text-field title-input" placeholder="FAQ Title" value={this.title} onChange={ev => this.title = ev.target.value} />
            
            {this.renderContent}
          </form>
          <Navigator admin loggedIn />
        </main>
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
    const { isAdmin } = jwt.decode(sessionToken) as DecodedJWT;
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
