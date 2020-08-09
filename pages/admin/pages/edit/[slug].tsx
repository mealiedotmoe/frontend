import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { InfoPage, DecodedJWT } from '../../../../utils/api-return-types';
import cookies from 'next-cookies';
import { apiFetch } from '../../../../utils/api-fetch';
import jwt from 'jsonwebtoken';
import { redirectToLogin } from '../../../../utils/login';
import Head from 'next/head';
import { PageTitle } from '../../../../components/page-title/page-title';
import ReactTooltip from 'react-tooltip';
import { computed, observable } from 'mobx';
import ReactMarkdown from 'react-markdown';
import { Navigator } from '../../../../components/navigator/navigator';
import { observer } from 'mobx-react';

@observer
class Pages extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private renderMarkdownPreview: boolean = false;
  @observable private content: string = "";
  @observable private title: string = "";

  public componentDidMount() {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return;
    }
    this.title = this.props.page.title;
    this.content = this.props.page.content;
  }
  @computed private get renderContent(): React.ReactNode {
    if (this.renderMarkdownPreview) return (
      <ReactMarkdown source={this.content} className="markdown-content" />
    );

    return (
      <textarea
        value={this.content}
        onChange={ev => this.content = ev.target.value}
        className="editor"
        placeholder="Page Content"
        style={{ minHeight: "60vh" }}
      />
    );
  }

  private async save(): Promise<void> {
    const result = await apiFetch<InfoPage>(`/info/${this.props.page.slug}`, "PUT", {
      content: this.content,
      title: this.title
    });
    window.location.pathname = `/pages/${result.slug}`;
  }

  public render() {
    return (
      <main className="pages-admin">
        <Head>
          <title>Edit - Page: Mealie.Moe</title>
        </Head>
        <article className="content-container">
          <PageTitle title="Edit Page" className="title" />
          <form onSubmit={ev => { ev.preventDefault(); this.save(); }}>
            <section className="meta-container">
              <input
                className="text-field title-input"
                placeholder="Page Title"
                value={this.title}
                onChange={ev => {
                  this.title = ev.target.value;
                }}
              />
              <input
                className="text-field slug-input"
                placeholder="Slug"
                value={this.props.page.slug}
                disabled
              />
              <button tabIndex={-1} data-tip data-for="slug-info" className="button text info-button" type="button">
                Slug Info
              </button>
              <ReactTooltip type="light" id="slug-info" effect="solid" place="right">
                Page will be visible at
                <br />
                https://mealie.moe/pages/{this.props.page.slug}
              </ReactTooltip>
            </section>
            {this.renderContent}
            <section className="actions">
              <a href="/markdown-guide" target="_blank">Markdown Guide</a>
              <div className="flex-grow" />
              <button type="button" className="button text" onClick={() => this.renderMarkdownPreview = !this.renderMarkdownPreview}>
                {this.renderMarkdownPreview && "Close"} Preview
              </button>
              <button type="submit" className="button">
                Save
              </button>
            </section>
          </form>
        </article>
        <Navigator centered admin />
      </main>
    );
  }
}

export default Pages;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
  page: InfoPage;
  isAdmin: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  const page = await apiFetch<InfoPage>(`/info/${context.params?.slug}`, "GET");
  if (token) {
    const { isAdmin } = jwt.decode(token) as DecodedJWT;
    return {
      props: {
        loggedIn: true,
        page,
        isAdmin
      }
    };
  }

  return {
    props: {
      loggedIn: false,
      page,
      isAdmin: false
    }
  }
};