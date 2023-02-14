const ctrlWraper = ctrl => {
  const innerFunc = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return innerFunc;
};

module.exports = ctrlWraper;
