import 'server-only';

import { hash, compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { User, users } from '@/db/schema';

export type UserDto = {
  id: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type UserDtoWithoutPassword = Omit<UserDto, 'password'>;

/**
 * Maps the common properties of a user object.
 *
 * @param user - The user object to map.
 * @returns An object containing the common properties of the user.
 */
function mapCommonProperties(user: User) {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    password: user.password,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

/**
 * Maps a User object to a DTO object.
 * @param item The input object to be mapped.
 * @returns The mapped DTO object.
 */
function toDtoMapper(item: User): any {
  const user = item as User;
  const commonProperties = mapCommonProperties(user);
  return {
    ...commonProperties,
  };
}

/**
 * Retrieves a query for fetching transactions from the database.
 * @returns {Query} The query object for fetching transactions.
 */
function getQuery() {
  return db.select().from(users).$dynamic();
}

/**
 * Retrieves a user by its ID.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise that resolves to a UserDto if the user is found, or null if not found.
 */
export async function getUserById(id: string): Promise<UserDto | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    return null;
  }

  return toDtoMapper(user);
}

/**
 * Retrieves a user by its Email.
 * @param email - The email of the user to retrieve.
 * @returns A Promise that resolves to a UserDto if the user is found, or null if not found.
 */
export async function getUserByEmail(email: string): Promise<UserDto | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return null;
  }

  return toDtoMapper(user);
}

/**
 * Creates a user.
 * @param email - The email of the user to create.
 * @param password - The password of the user to create.
 * @returns A Promise that resolves to a UserDto if the user is found, or null if not found.
 */
export async function createUser(
  email: string,
  password: string
): Promise<UserDtoWithoutPassword> {
  try {
    const user = await db
      .insert(users)
      .values({
        email,
        password: await hash(password, 10),
      })
      .returning();

    // check if user was created
    if (!user) {
      throw new Error('User could not be created');
    }

    const { password: _, ...userWithoutPassword } = user[0];

    return userWithoutPassword;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function login(
  email: string,
  password: string
): Promise<UserDtoWithoutPassword | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isOk = await compare(password, user.password);

  if (!isOk) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
