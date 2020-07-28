import * as React from 'react';
import { MdWarning } from 'react-icons/md';

export interface AlertProps {
  message: string;
}

export const Alert: React.FunctionComponent<AlertProps> = ({ message }): JSX.Element => (
  <section className="alert">
    <MdWarning className="icon" />
    <section className="content">
      {message}
    </section>
  </section>
);