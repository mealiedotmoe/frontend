import * as React from 'react';
import { IFAQ } from '../../utils/api-return-types';
import Color from 'color';
import Constants from "../../utils/constants.json";

export interface FAQCardProps extends IFAQ {
  selected?: boolean;
}

export const FAQCard: React.FunctionComponent<FAQCardProps & { createNew?: boolean; }> = (props: FAQCardProps & { createNew?: boolean; }): JSX.Element => {
  if (props.createNew) {
    return (
      <section className="faq-card create">
        Create new FAQ
      </section>
    );
  }
  return (
    <section className={`faq-card ${props.selected && "selected"}`}>
      <section className="faq-card-title">
        {props.title}
      </section>
      <section className="faq-card-tags">
        <div
          className="faq-tag"
          style={{
            background: props.color,
            color: Color(props.color).contrast(Color("#FFFFFF")) < Constants.FAQ_TAGS_MIN_CONTRAST ? "#202020" : "#FFFFFF"
          }}
        >
          <span>{props.tag}</span>
        </div>
      </section>
    </section>
  );
};