/**
 * Handles the POST request for login a user.
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
  } catch (error) {
    return Response.json({
      status: 500,
      error,
    });
  }
}
