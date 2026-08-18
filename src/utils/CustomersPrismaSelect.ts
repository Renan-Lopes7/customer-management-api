export const customerSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  created_at: true,
  updated_at: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};
