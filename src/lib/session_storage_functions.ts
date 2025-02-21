export const getFromSessionStorage = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error("Error parsing session storage item", error);
    return null;
  }
};

export const saveToSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};
