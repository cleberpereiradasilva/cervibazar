import { SignJWT, jwtVerify } from "jose";

const issuer = "cervi-bazar";
const audience = "cervi-bazar-app";
const EXPIRATION = "3h";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não definido.");
  }
  return new TextEncoder().encode(secret);
}

type TokenPayload = {
  sub: string;
  username: string;
  role: "admin" | "caixa" | "root";
};

export async function signAuthToken(payload: TokenPayload) {
  const secret = getSecret();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(EXPIRATION)
    .sign(secret);
  return token;
}

export async function verifyAuthToken(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret, {
    issuer,
    audience,
  });
  return payload as TokenPayload;
}
