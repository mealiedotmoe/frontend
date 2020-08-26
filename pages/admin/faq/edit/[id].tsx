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
import { observable, computed } from 'mobx';
import { ChromePicker } from "react-color";
import Head from 'next/head';
import Router from 'next/router';
import { Navigator } from '../../../../components/navigator/navigator';
import ReactMarkdown from 'react-markdown';
import { DraggablePanel } from '../../../../components/panel-drag/draggable-panel';
import Constants from "../../../../utils/constants.json";

@observer
class EditFAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private faqContent: { content: string } = {
    content: ""
  };
  @observable private textAreaRef: React.RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();
  @observable private tag = "";
  @observable private color = "#FFFFFF";
  @observable private displayColorPicker = false;
  @observable private displayRenderContent = false;
  @observable private submitting = false;

  public componentDidMount(): void {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return;
    }
    this.faqContent.content = this.props.currentFAQ.content;
    this.color = this.props.currentFAQ.color;
    this.tag = this.props.currentFAQ.tag;
  }

  @computed public get renderEditor(): React.ReactNode {
    if (this.displayRenderContent) return null;

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
          <button className="button text" type="button" onClick={() => this.displayRenderContent = true}>
            Preview
          </button>
          <button className="button" type="submit" disabled={this.submitting}>
            {this.submitting ? "Saving..." : "Save FAQ"}
          </button>
        </section>
      </form>
    );
  }

  @computed private get renderedContent(): React.ReactNode {
    if (!this.displayRenderContent) return null;

    return (
      <section className="rendered-content-container">
        <ReactMarkdown
          source={this.faqContent.content}
          className="markdown-content"
          renderers={{ link: props => <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a> }}
        />
        <button className="button text" onClick={() => this.displayRenderContent = false}>
          Close Preview
        </button>
      </section>
    )
  }

  private async save(): Promise<void> {
    this.submitting = true;
    const response = await apiFetch<ISpecificFAQ>(`/faq/${this.props.currentFAQ.id}`, "PUT", {
      title: this.props.currentFAQ.title,
      content: this.faqContent.content,
      tag: this.tag,
      color: this.color
    });
    Router.push(`/faq/${response.id}`);
    this.submitting = false;
  }

  public render(): React.ReactNode {
    return (
      <main className="faq-admin-container">
        <Head>
          <title>
            Editing: {this.props.currentFAQ.title}; Mealie.Moe - Admin
          </title>
        </Head>
        <DraggablePanel className="faq-card-list">
          <section className="scroll-container">
            <Link href="/admin/faq/create">
              <a>
                <FAQCard tag="" title="" color="" id={0} createNew />
              </a>
            </Link>
            <h1 className="title">Edit List</h1>
            {this.props.faqs.map(faq => (
              <Link href={`/admin/faq/edit/${faq.id}`} key={faq.id}>
                <a>
                  <FAQCard {...faq} selected={this.props.currentFAQ.id === faq.id} />
                </a>
              </Link>
            ))}
          </section>
        </DraggablePanel>
        <section className="faq-card-content">
          <PageTitle title={`Editing: ${this.props.currentFAQ.title}`} />
          <section className="tag-control">
            <div
              className="faq-tag"
              style={{
                background: this.color,
                color: Color(this.color).contrast(Color("#FFFFFF")) < Constants.FAQ_TAGS_MIN_CONTRAST ? "#202020" : "#FFFFFF"
              }}
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
          {this.renderedContent}
          <Navigator admin loggedIn />
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
    const { isAdmin } = jwt.decode(sessionToken) as DecodedJWT;
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
