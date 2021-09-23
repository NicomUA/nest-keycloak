export class KeycloakUser {
  uid = 'anonymous';
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  username = 'anonymous';
  roles: string[] = [];
  attributes: any[] = [];

  constructor(props?) {
    if (props) {
      Object.assign(this, props);
    }
  }

  isAnonymous(): boolean {
    return this.uid === 'anonymous';
  }
}
