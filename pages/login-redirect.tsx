import * as React from 'react';
import { observable } from 'mobx';
import { API_BASE } from '../utils/api-fetch';
import { observer } from 'mobx-react';

@observer
export default class LoginRedirect extends React.Component<{}> {
  @observable private timeout: any = null;
  @observable private timer: number = 5;

  public componentDidMount(): void {
    this.timeout = setTimeout(() => window.location.href = `${API_BASE}/auth/login`, 5000);
    setInterval(() => this.timer >= 0 && this.timer--, 1000);
  }

  private goBack(): void {
    clearTimeout(this.timeout);
    window.location.pathname = window.localStorage.getItem("callback-to") as string;
  }

  private redirect(): void {
    clearTimeout(this.timeout);
    window.location.href = `${API_BASE}/auth/login`;
  }

  public render() {
    return (
      <main className="login-redirect">
        <section>
          You are being redirected to the discord login page in {this.timer} seconds.
          <br />
          <br />
          <button className="button jumbo" onClick={() => this.goBack()}>
            Go back
          </button>
          &nbsp;
          <button className="button jumbo" onClick={() => this.redirect()}>
            Just take me there
          </button>
        </section>
      </main>
    )
  }
}
