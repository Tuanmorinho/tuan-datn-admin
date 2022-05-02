export class AuthModel {
  id:number;
  username: string;
  email: string;
  roleName: string;
  groupName: string;
  accessToken: string;


  setAuth(auth: any) {
    this.id = auth.id;
    this.username = auth.username;
    this.email = auth.email;
    this.roleName = auth.roleName;
    this.groupName = auth.groupName
    this.accessToken = auth.accessToken;
  }
}
