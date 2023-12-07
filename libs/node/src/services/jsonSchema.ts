import { validate } from 'jsonschema';
import { Request } from 'express';
import { AppJSONSchemaValidationError } from './errors';


export function validateRequest<SchemaT = object>(
  req: Request,
  schema: SchemaT,
): Promise<{ data: object; schema: SchemaT }> {
  console.log('req', req.body);
  const requestData = JSON.stringify(req.body) !== '{}' ? req.body : req.query;

  return validatePromise<object, SchemaT>(requestData, schema);
}

export function validatePromise<DataT = object, SchemaT = object>(
  data: DataT,
  schema: SchemaT,
): Promise<{ data: DataT; schema: SchemaT }> {
  const { valid, errors } = validate(data, schema);
  if (valid) {
    return Promise.resolve({
      data,
      schema,
    });
  } else {
    return new Promise((resolve, reject) => reject(new AppJSONSchemaValidationError(errors)));
  }
}
