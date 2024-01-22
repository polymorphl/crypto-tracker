import { createUser, getUserByEmail } from '@/data/users';

export async function GET() {
  return Response.json({ status: 200, data: 'GET /api/user' });
}

/**
 * Handles the POST request for creating a user.
 *
 * @param req - The request object.
 * @returns A JSON response with the status and body.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      return Response.json({
        status: 400,
        error: 'Email is required',
      });
    }

    if (!body.password) {
      return Response.json({
        status: 400,
        error: 'Password is required',
      });
    }

    const existingUserByEmail = await getUserByEmail(body.email);
    if (existingUserByEmail) {
      return Response.json({
        status: 400,
        error: 'User already exists',
      });
    }

    const createdUser = await createUser(body.email, body.password);

    if (!createdUser) {
      return Response.json({
        status: 500,
        error: 'Could not create user',
      });
    }

    return Response.json({
      status: 200,
      data: createdUser,
    });
  } catch (error) {
    return Response.json({
      status: 500,
      error,
    });
  }
}
