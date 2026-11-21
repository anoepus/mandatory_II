import bcrypt from 'bcrypt';

async function run() {
  const plainPassword = 'admin';
  const saltRounds = 14;

  // Hash password
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hash:', hash);

  // Compare password against hash
  const isMatch = await bcrypt.compare(plainPassword, hash);
  console.log('Matches:', isMatch);
}

run();