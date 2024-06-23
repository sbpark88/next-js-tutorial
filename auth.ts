import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // https://authjs.dev/getting-started/authentication
  // 4 종류가 있다.
  // - OAuth: Google, GitHub, Twitter, etc.
  // - Magic Links: Resend, Sendgrid, Nodemailer, Postmark, etc.
  // - Credentials: Email/PW 를 사용해 직접 인증.
  // - WebAuthn: 실험적 기능으로 아직 production 에서 사용은 권장하지 않음.
  // 여기서는 Credentials 만 구현한다.
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null; // parsedCredentials 에 실패했거나 비밀번호가 불일치 하는 경우
      },
    }),
  ],
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`
        SELECT id
             , name
             , email
             , password
        FROM users
        WHERE email = ${email}
    `;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
