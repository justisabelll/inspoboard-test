import { db, userTable } from '../db';

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

async function addAdmin() {
  const hashedPassword = (async () => {
    if (!password) {
      throw new Error('ADMIN_PASSWORD is not set');
    }
    return await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 12,
    });
  })();

  if (!username) {
    throw new Error('ADMIN_USERNAME is not set');
  }

  await db.insert(userTable).values({
    username: username,
    password: await hashedPassword,
    created_at: new Date(),
  });
}

addAdmin();
