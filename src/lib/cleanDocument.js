export const cleanDocument = (doc) => {
    if (!doc) return doc;

    const { $id, $createdAt, $updatedAt, ...rest } = doc;

    return {
        id: $id,
        created_at: $createdAt,
        updated_at: $updatedAt,
        ...rest // Keeps all your custom attributes (title, status, etc.)
    };
};
