export const catchAsync =
  (fn) =>
  async (parent, args, context, info) => {
    try {
      return await fn(parent, args, context, info);
    } catch (err) {
      throw err;
    }
  };

