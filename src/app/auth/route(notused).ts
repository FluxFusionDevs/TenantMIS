// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabaseClient';
// import logger from '@/logger/logger';

// export async function POST(req: NextRequest) {
//   const { type, email, password } = await req.json();

//   switch (type) {
//     case "signin":
//       const { data: signInUser, error: signInError } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (signInError) {
//         logger.error(`SignIn Error: ${signInError.message}`);
//         return NextResponse.json({ message: "Invalid Email or Password", status: signInError.status });
//       }

//       logger.info(`User signed in: ${signInUser.user?.email}`);
//       return NextResponse.json({ user: signInUser.user, message: "Successfully signed in", status: 200 });

//     case "reset":
//       const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

//       if (resetError) {
//         logger.error(`Reset Password Error: ${resetError.message}`);
//         return NextResponse.json({ message: resetError.message, status: resetError.status });
//       }

//       logger.info(`Password reset email sent to: ${email}`);
//       return NextResponse.json({ message: "Password reset email sent", status: 200 });

//     default:
//       logger.warn(`Invalid request type: ${type}`);
//       return NextResponse.json({ message: "Unknown type", status: 400 });
//   }
// }