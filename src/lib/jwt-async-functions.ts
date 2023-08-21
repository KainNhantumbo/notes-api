import * as jwt from 'jsonwebtoken';

/**
 * @param user_id user id string
 * @param secret jwt secret key
 * @param exp time to token expire
 * @returns Promise<unknown>
 */
const createToken = async (
  data: object,
  secret: string,
  exp: string | number
): Promise<unknown> => {
  return new Promise((resolve): void => {
    const token = jwt.sign({ ...data }, secret, {
      expiresIn: exp,
    });
    resolve(token);
  });
};

/**
 * An asynchronous function to verify integrity of the token.
 * @param token string
 * @param secret string
 * @returns Promise<unknown>
 */
const verifyToken = (token: string, secret: string): Promise<unknown> => {
  return new Promise((resolve): void => {
    const result = jwt.verify(token, secret);
    resolve(result);
  });
};

export { createToken, verifyToken };
