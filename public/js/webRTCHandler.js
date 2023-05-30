export const sendPreOffer = (type, callPersonalCode) => {
  console.log("send preoffser", type, callPersonalCode);
  const data = {
    type,
    callPersonalCode,
  };

  return data;
};

export const handlePreOffer = (data) => {
  console.log("send preoffser from server", data);
};
