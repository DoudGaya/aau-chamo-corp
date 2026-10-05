import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function testDatabase() {
  console.log("=== Testing Shared ERP Database for Website Users & Sales ===");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Connected successfully to Neon ERP Database!");

  // 1. Check Sales lines and distinct products
  const productsRes = await client.query(`
    SELECT DISTINCT "productName", COUNT(*) as line_count, SUM("quantity" * "unitPrice") as total_gross
    FROM sale_lines
    GROUP BY "productName"
    ORDER BY total_gross DESC
    LIMIT 5;
  `);
  console.log("\nTop 5 Products in ERP Sales Lines:");
  console.table(productsRes.rows);

  // 2. Check Website Users table
  const testUserEmail = `test.client.${Date.now()}@aauchamo.local`;
  const insertUserRes = await client.query(`
    INSERT INTO website_users (
      id, full_name, email, phone, company_name, account_type, selected_services, password_hash, status, city
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING id, full_name, email, company_name, account_type, selected_services, status;
  `, [
    `wu_${Date.now()}`,
    "Alhaji Musa Danbaba",
    testUserEmail,
    "+2348031234567",
    "Danbaba Global Freight Ltd",
    "CORPORATE",
    JSON.stringify(["Air Cargo & Freight Forwarding", "Flight Reservations & Ticketing"]),
    "test_salt:test_hash",
    "ACTIVE",
    "Kano"
  ]);

  console.log("\nSuccessfully created test website user in shared ERP database:");
  console.log(insertUserRes.rows[0]);

  // 3. Verify querying website_users
  const queryUserRes = await client.query(`
    SELECT id, full_name, email, company_name, account_type, selected_services, status, created_at
    FROM website_users
    WHERE email = $1;
  `, [testUserEmail]);

  console.log("\nVerified website user retrieved from ERP DB:");
  console.log(queryUserRes.rows[0]);

  // 4. Test submitting an enquiry linked to this user
  const enquiryRes = await client.query(`
    INSERT INTO website_enquiries (
      reference, type, customer_name, customer_email, customer_phone, message, department, source, user_id, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING id, reference, type, status, created_at;
  `, [
    `AAU-${Math.floor(100000 + Math.random() * 900000)}`,
    "Air Cargo & Freight Forwarding",
    "Alhaji Musa Danbaba",
    testUserEmail,
    "+2348031234567",
    "Consignment of 450kg textiles from Kano to Jeddah.",
    "Cargo Operations",
    "portal",
    insertUserRes.rows[0].id,
    "New"
  ]);

  console.log("\nSuccessfully created portal enquiry in ERP database:");
  console.log(enquiryRes.rows[0]);

  // Clean up test data
  await client.query(`DELETE FROM website_enquiries WHERE user_id = $1`, [insertUserRes.rows[0].id]);
  await client.query(`DELETE FROM website_users WHERE id = $1`, [insertUserRes.rows[0].id]);
  console.log("\nCleaned up test user and enquiry.");

  await client.end();
  console.log("\nAll tests passed successfully!");
}

testDatabase().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
