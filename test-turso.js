const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.LIBSQL_AUTH_TOKEN;
  console.log("URL:", url);
  console.log("Token length:", authToken?.length);

  const client = createClient({ url, authToken });
  try {
    const res = await client.execute("SELECT 1;");
    console.log("Query Success:", res.rows);
  } catch (err) {
    console.error("Query Error:", err);
  }
}
main();
