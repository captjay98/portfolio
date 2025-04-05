import { Databases, Permission, Role } from "node-appwrite";

// standard permissions to be used across all collections everyone can read, only admin can create, update, delete
export const standardPermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.label("admin")),
  Permission.update(Role.label("admin")),
  Permission.delete(Role.label("admin")),
];

// Helper function to create or get a collection with standard or custom permissions
export async function getOrCreateCollection(
  databases: Databases,
  databaseId: string,
  collectionId: string,
  name: string,
  customPermissions?: Permission[],
): Promise<string> {
  // Use custom permissions if provided, otherwise use standard permissions
  const permissions = customPermissions || standardPermissions;

  try {
    const collection = await databases.getCollection(databaseId, collectionId);
    if (collection) {
      console.log(
        `Collection '${name}' already exists with ID: ${collectionId}`,
      );
    }

    // Update permissions on existing collection
    await databases.updateCollection(
      databaseId,
      collectionId,
      name,
      permissions as string[],
    );
    console.log(`Updated permissions for collection '${name}'`);

    return collectionId;
  } catch (error) {
    // Collection doesn't exist, create it with provided permissions
    const collection = await databases.createCollection(
      databaseId,
      collectionId,
      name,
      permissions as string[],
    );
    console.log(`Created collection '${name}' with ID: ${collection.$id}`);
    return collection.$id;
  }
}
