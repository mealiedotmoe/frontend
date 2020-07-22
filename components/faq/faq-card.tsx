import * as React from 'react';
import { IFAQ } from '../../utils/api-return-types';
import Color from 'color';

export interface FAQCardProps extends IFAQ {
  selected?: boolean;
}

export const FAQCard: React.FunctionComponent<FAQCardProps> = (props): JSX.Element => (
  <section className={`faq-card ${props.selected && "selected"}`}>
    <section className="faq-card-title">
      {props.title}
    </section>
    <section className="faq-card-tags">
      <div className="faq-tag" style={{ background: props.color, color: Color(props.color).contrast(Color("#FFFFFF")) < 3 ? "#202020" : "#FFFFFF" }}>
        <span>{props.tag}</span>
      </div>
    </section>
  </section>
);