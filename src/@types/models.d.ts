interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: { id: string; url: string };
  password: string;
  last_session: Date;
}
