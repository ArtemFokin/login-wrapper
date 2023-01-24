export const isSameOrigin = () => {
  try {
    //we have access to parent location - so it's same origin
    return !!window.parent?.location?.href;
  } catch (err) {}

  return false;
};
