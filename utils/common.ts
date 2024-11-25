export const sleep = (timout: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timout);
  });
};

const generateRandomColor = () => {
  const random = Math.floor(Math.random() * 16777215).toString(16);
  return `#${random}`;
};

export const chunkArray = (array: Array<any>, size: number) => {
  let result = [];
  for (let value of array) {
    let lastArray = result[result.length - 1];
    if (!lastArray || lastArray.length == size) {
      result.push([value]);
    } else {
      lastArray.push(value);
    }
  }
  return result;
};

export const isEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const replacePlaceholder = (
  template: string,
  data: Record<string, any>
) => {
  try {
    return template.replace(/{(\w+)}/g, (keyVariable, keyData) =>
      data.hasOwnProperty(keyData) ? data[keyData] : ''
    );
  } catch (error) {
    console.error("replacePlaceholder", error);
    throw error;
  }
};

export const parseElementorWebhookFields = (body: string) => {
  try {
    const params = new URLSearchParams(body);
    const result = Object.fromEntries(params.entries());
    const mappedFields = Object.entries(result).reduce(
      (acc: any, [key, value]) => {
        // Check if the key contains 'fields' and has an 'id' suffix
        if (key.includes("fields") && key.endsWith("[id]")) {
          const fieldKey = key.replace("[id]", "[value]");
          acc[value] = result[fieldKey]; // Map id to value
        }
        return acc;
      },
      {}
    );

    return mappedFields;
  } catch (error) {
    return {};
  }
};
