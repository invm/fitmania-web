import { IObject } from '../interfaces/Common';

export const stripObject = (obj: IObject) => {
  Object.keys(obj).forEach((k) => !obj[k] && delete obj[k]);
  return obj;
};

const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
  if (data && typeof data === 'object' && data?.uri) {
    formData.append(parentKey ?? '', data);
  } else if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey ?? '', value);
  }
};

export const toFormData = (data: IObject) => {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
};
