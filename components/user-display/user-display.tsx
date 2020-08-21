import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { apiFetch } from '../../utils/api-fetch';
import { User } from '../../utils/api-return-types';

@observer
export class UserDisplay extends React.Component<{ className?: string; user: string; append?: string; }> {
  @observable private user = "loading...";

  @action private async getUserData(): Promise<void> {
    try {
      const result = await apiFetch<User>(`/user/${this.props.user}`, "GET");
      this.user = result.username;
    } catch (e) {
      this.user = "Unknown";
    }
  }

  public componentDidMount(): void {
    this.getUserData();
  }

  public render(): React.ReactNode {
    return (
      <span className={this.props.className}>
        {this.props.append}{this.user}
      </span>
    )
  }
}