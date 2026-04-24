import db from "../client.js";

/**
 * Creates a favorite relationship between a user and a business.
 * Returns the new favorite row if created.
 */
export async function createFavorite(user_id, business_id) {
  const SQL = `
    INSERT INTO favorites (user_id, business_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, business_id) DO NOTHING
    RETURNING *;
  `;

  const { rows } = await db.query(SQL, [user_id, business_id]);
  return rows[0];
}

/**
 * Gets all favorites for a specific user, joined with business info.
 * Returns an array of the user's favorited businesses.
 */
export async function getFavoritesByUser(user_id) {
  const SQL = `
    SELECT 
      favorites.id AS favorite_id,
      businesses.id AS business_id,
      businesses.name,
      businesses.category,
      businesses.description,
      businesses.location
    FROM favorites
    JOIN businesses
      ON favorites.business_id = businesses.id
    WHERE favorites.user_id = $1
    ORDER BY favorites.id;
  `;

  const { rows } = await db.query(SQL, [user_id]);
  return rows;
}

/**
 * Deletes a favorite for a given user and business pair.
 * Returns the deleted favorite row.
 */
export async function deleteFavorite(user_id, business_id) {
  const SQL = `
    DELETE FROM favorites
    WHERE user_id = $1 AND business_id = $2
    RETURNING *;
  `;

  const { rows } = await db.query(SQL, [user_id, business_id]);
  return rows[0];
}