import * as React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { apiFetch } from '../../../utils/api-fetch';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';
import { DecodedJWT, InfoPage } from '../../../utils/api-return-types';
import { redirectToLogin } from '../../../utils/login';
import Head from 'next/head';
import { PageTitle } from '../../../components/page-title/page-title';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import ReactMarkdown from 'react-markdown';
import ReactTooltip from 'react-tooltip';
import { Navigator } from '../../../components/navigator/navigator';

@observer
class Pages extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private renderMarkdownPreview = false;
  @observable private content = "";
  @observable private title = "";
  @observable private slug = "";
  @observable private saving = false;

  public componentDidMount(): void {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return;
    }
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
    this.saving = true;
    const response = await apiFetch<InfoPage>("/info", "POST", {
      title: this.title,
      slug: this.slug,
      content: this.content
    });
    window.location.pathname = `/pages/${response.slug}`;
    this.saving = false;
  }

  public render(): React.ReactNode {
    return (
      <main className="pages-admin">
        <Head>
          <title>Create - Page: Mealie.Moe</title>
        </Head>
        <article className="content-container">
          <PageTitle title="Create Page" className="title" />
          <form onSubmit={ev => { ev.preventDefault(); this.save(); }}>
            <section className="meta-container">
              <input
                className="text-field title-input"
                placeholder="Page Title"
                value={this.title}
                onChange={ev => {
                  this.title = ev.target.value;
                  this.slug = this.title.toLocaleLowerCase().replace(/ /g, "-");
                }}
              />
              <input
                className="text-field slug-input"
                placeholder="Slug"
                value={this.slug}
                onChange={ev => this.slug = ev.target.value}
              />
              <button tabIndex={-1} data-tip data-for="slug-info" className="button text info-button" type="button">
                Slug Info
              </button>
              <ReactTooltip type="light" id="slug-info" effect="solid" place="right">
                Page will be visible at
                <br />
                https://mealie.moe/pages/{this.slug === "" ? <i>slug-goes-here</i> : this.slug}
              </ReactTooltip>
            </section>
            {this.renderContent}
            <section className="actions">
              <a href="/markdown-guide" target="_blank">Markdown Guide</a>
              <div className="flex-grow" />
              <button type="button" className="button text" onClick={() => this.renderMarkdownPreview = !this.renderMarkdownPreview}>
                {this.renderMarkdownPreview && "Close"} Preview
              </button>
              <button type="submit" className="button" disabled={this.saving}>
                {this.saving ? "Saving..." : "Save"}
              </button>
            </section>
          </form>
        </article>
        <Navigator centered admin />
      </main>
    );
  }
}

export default Pages;export const getServerSideProps: GetServerSideProps<{
  isAdmin: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const sessionToken = cookies(context)["session-jwt"] ?? null;
  if (sessionToken) {
    const { isAdmin } = jwt.decode(sessionToken) as DecodedJWT;
    return {
      props: {
        isAdmin,
      }
    };
  }
  return {
    props: {
      isAdmin: false,
    }
  };
};
