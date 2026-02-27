// ============ ADVANCED PATH TYPES ============

import { PurchaseRequest } from "./global-state";

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

type IsPrimitive<T> = T extends Primitive | Date ? true : false;

type PathImpl<T> = T extends Primitive | Date
  ? never
  : T extends Array<infer U>
    ? IsPrimitive<U> extends true
      ? never
      : PathImpl<U>
    : {
        [K in keyof T & string]: IsPrimitive<T[K]> extends true
          ? K
          : T[K] extends Array<infer U>
            ?
                | K
                | `${K}.${number}`
                | (IsPrimitive<U> extends true
                    ? never
                    : `${K}.${number}.${PathImpl<U>}`)
            : K | `${K}.${PathImpl<T[K]>}`;
      }[keyof T & string];

export type Path<T> = PathImpl<T>;

export type PurchaseRequestPath = Path<PurchaseRequest>;

export type PathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : K extends `${number}`
      ? T extends Array<infer U>
        ? PathValue<U, Rest>
        : never
      : never
  : P extends keyof T
    ? T[P]
    : P extends `${number}`
      ? T extends Array<infer U>
        ? U
        : never
      : never;
