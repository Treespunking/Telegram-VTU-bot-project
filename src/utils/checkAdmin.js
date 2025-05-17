module.exports = (ctx) => {
  const adminId = Number(process.env.ADMIN_USER_ID);
  return ctx.from && ctx.from.id === adminId;
};
