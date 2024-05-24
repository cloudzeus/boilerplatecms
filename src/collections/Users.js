const Users = {
  slug: "users",
  auth: {
    cookies: {
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "testing" ? "none" : "lax",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};

export default Users;
