import { createUser, getUserByEmail } from '@/data/users';

export async function GET() {
  return Response.json({ data: 'GET /api/user' }, { status: 200 });
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
      return Response.json(
        {
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    if (!body.password) {
      return Response.json(
        {
          error: 'Password is required',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await getUserByEmail(body.email);
    if (existingUserByEmail) {
      return Response.json(
        {
          error: 'User already exists',
        },
        { status: 400 }
      );
    }

    const createdUser = await createUser(body.email, body.password);

    if (!createdUser) {
      return Response.json(
        {
          error: 'Could not create user',
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        data: createdUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        error,
      },
      { status: 500 }
    );
  }
}
