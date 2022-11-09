exports.buildErrorResponse = (code, message) => {
  return { code, message };
};

exports.buildErrorServerResponse = (code, message, error) => {
  return { code, message, error };
};

exports.buildValidresponse = (message, data) => {
  return { message, data };
};

exports.buildValidDeleteresponse = (message) => {
  return { message };
};
