import jwt from 'jsonwebtoken'

const secret: string = 'lisztomania';
const expiration: string = '2h';

  export const auth = ({ req }) => {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data }: any = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
     
    } catch {
      console.log('Invalid token');
    }

    return req;
  }

  export const signToken = ({ firstName, email, _id }) => {
    const payload = { firstName, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }

