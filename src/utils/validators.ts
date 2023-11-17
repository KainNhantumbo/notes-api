import PasswordValidator from 'password-validator';

export function validateEmail(data: string): boolean {
  const regex: RegExp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const result: RegExpExecArray | null = regex.exec(String(data));
  if (!result) return false;
  return true;
}

export async function validatePassword(data: string) {
  return await new Promise((resolve) => {
    const schema = new PasswordValidator()
      .is()
      .min(8, 'The password should have a minimum of 8 characters')
      .is()
      .symbols(
        2,
        'The password should have a minimum of 2 special symbols, like @#+/*%!&.'
      )
      .is()
      .max(21, 'The password should not have a more than of 21 characters')
      .has()
      .not()
      .spaces(undefined, 'The password should not have spaces');

    resolve(schema.validate(data, { details: true }));
  });
}
