import * as React from 'react';
import { observable } from 'mobx';
import { API_BASE } from '../utils/api-fetch';
import { observer } from 'mobx-react';
import Constants from "../utils/constants.json";

@observer
export default class LoginRedirect extends React.Component<Record<string, unknown>> {
  @observable private timeout: NodeJS.Timeout = setTimeout(() => { return; }, Constants.EMPTY_LENGHT);
  @observable private timer = Constants.LOGIN_REDIRECT_TIMEOUT;

  public componentDidMount(): void {
    this.timeout = setTimeout(
      () => window.location.href = `${API_BASE}/auth/login`,
      Constants.LOGIN_REDIRECT_TIMEOUT * Constants.SECONDS_TO_MILLISECONDS_FACTOR
    );
    setInterval(
      () => this.timer >= Constants.EMPTY_LENGHT && this.timer--,
      Constants.SECONDS_TO_MILLISECONDS_FACTOR
    );
  }

  private goBack(): void {
    clearTimeout(this.timeout);
    window.location.pathname = window.localStorage.getItem("callback-to") as string;
  }

  private redirect(): void {
    clearTimeout(this.timeout);
    window.location.href = `${API_BASE}/auth/login`;
  }

  public render(): React.ReactNode {
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
