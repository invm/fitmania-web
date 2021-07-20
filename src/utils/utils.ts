import { IObject } from '../interfaces/Common';

export const stripObject = (obj: IObject) => {
  Object.keys(obj).forEach((k) => !obj[k] && delete obj[k]);
  return obj;
};

export const toFormData = (obj: IObject) => {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    if (key === 'postImage') {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((img: any, i: number) => {
          formData.append(key, img, `${i}.jpeg`);
        });
      } else {
        formData.append(key, obj[key], `${key}.jpeg`);
      }
    } else if (key && typeof obj[key] === 'object' && Object.prototype.toString.call(obj[key]) === '[object Date]') {
      formData.append(key, `${new Date(obj[key]).valueOf()}`);
    } else if (key && typeof obj[key] === 'object') {
      Object.keys(obj[key]).forEach((k) => {
        formData.append(`${key}[${k}]`, obj[key][k]);
      });
    } else if (key && Array.isArray(obj[key])) {
      obj[key].forEach((val: any) => {
        formData.append(key, val);
      });
    } else if (key) {
      formData.append(key, obj[key]);
    }
  });

  return formData;
};
