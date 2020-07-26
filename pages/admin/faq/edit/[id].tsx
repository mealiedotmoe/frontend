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
import { observable, computed, observe } from 'mobx';

@observer
class EditFAQ extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private faqContent: { content: string } = {
    content: ""
  };
  @observable private textAreaRef: React.RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();

  public componentDidMount() {
    if (!this.props.isAdmin) {
      redirectToLogin();
      return null;
    }
    observe(this.faqContent, (change) => {
      if (!this.textAreaRef.current) return;
      this.textAreaRef.current.style.height = "0px";
      this.textAreaRef.current.style.height = `${this.textAreaRef.current.scrollHeight}px`;
    });
    this.faqContent.content = this.props.currentFAQ.content;
  }

  @computed public get renderEditor(): React.ReactNode {
    return (
      <section className="editor-container">
        <textarea
          value={this.faqContent.content}
          className="editor" onChange={ev => this.faqContent.content = ev.target.value}
          ref={this.textAreaRef}
          style={{
            minHeight: this.textAreaRef.current?.scrollHeight ?? 400,
          }}
        />
        <button className="button">
          Save FAQ
        </button>
      </section>
    );
  }

  public render() {
    return (
      <main className="faq-admin-container">
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
          <div
            className="faq-tag"
            style={{ background: this.props.currentFAQ.color, color: Color(this.props.currentFAQ.color).contrast(Color("#FFFFFF")) < 3 ? "#202020" : "#FFFFFF" }}
          >
            <span>{this.props.currentFAQ.tag}</span>
          </div>
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
