import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        console.log('🔹 Google Profile:', profile);

        // Cek apakah user sudah ada di database
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          console.log('✅ User baru dari Google:', profile.email);

          // Buat user baru tanpa password
          user = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            },
          });
        }

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(JSON.stringify({ message: ['Email and Password are required'] }));
        }

        console.log('📌 Login attempt:', credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error(JSON.stringify({ message: ['Invalid email or password'] }));
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error(JSON.stringify({ message: ['Invalid email or password'] }));
        }

        console.log('✅ Login successful:', credentials.email);
        
return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt', // Gunakan database agar session bisa tersimpan di tabel Prisma
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        if (existingUser) {
          // Jika akun sudah ada tetapi tidak memiliki akun Google, tambahkan akun Google
          const googleAccountExists = existingUser.accounts.some(
            (acc) => acc.provider === "google"
          );

          if (!googleAccountExists) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                id_token: account.id_token,
                scope: account.scope,
                session_state: account.session_state,
              },
            });
          }

          return true;
        }
      }

      return true;
    },
  },

  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
