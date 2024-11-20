import type { OpenApiBody, OpenApiParams, OpenApiPaths, OpenApiQuery, OpenApiResponse } from '~/openapi/type-utils';

import { useAuthStore } from '~/stores/auth';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface Options<
  M extends Method,
  P extends OpenApiPaths<M>,
> {
  path?: OpenApiParams<M, P>,
  body?: OpenApiBody<M, P>,
  query?: OpenApiQuery<M, P>,
  fetchOptions?: Omit<RequestInit, 'method' | 'body'> & { [key: string]: any },
  auth?: boolean,
}

class RestException extends Error {
  data: any;

  constructor(message: string, data?: any) {
    super(message);
    this.data = data;
  }
}

type Result<
  M extends Method,
  P extends OpenApiPaths<M>,
> = {
  data: OpenApiResponse<M, P>,
  error: null,
} | {
  data: null,
  error: RestException,
};

const restClient = async <
  M extends Method,
  P extends OpenApiPaths<M>,
>(method: M, url: P, options?: Options<M, P>): Promise<Result<M, P>> => {
  let patchedUrl: string = url;

  if (options?.path) {
    for (const [key, value] of Object.entries(options.path)) {
      patchedUrl = patchedUrl.replace(`{${ key }}`, value);
    }
  }

  const parsedUrl = new URL(patchedUrl, useRuntimeConfig().public.apiUrl);

  if (options?.query) {
    for (const [key, value] of Object.entries(options.query)) {
      parsedUrl.searchParams.append(key, value as string);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.auth !== false) {
    headers.Authorization = `Bearer ${ await useAuthStore().getAccessToken() }`;
  }

  if (options?.fetchOptions?.headers) {
    if (typeof options.fetchOptions.headers === 'object') {
      Object.assign(headers, options.fetchOptions.headers);
    } else {
      throw new TypeError('Invalid headers type');
    }
  }

  const { data, error } = await fetch(parsedUrl, {
    ...options?.fetchOptions,
    method: method.toUpperCase(),
    headers,
    body: options?.body && JSON.stringify(options.body),
  })
    .then(async (response) => {
      if (response.status === 401 && options?.auth !== false) {
        useAuthStore().signOut();
        throw new RestException('Unauthorized', await response.json());
      }

      if (!response?.ok) {
        const data = await response.json();
        throw new RestException(
          data?.message || response?.statusText,
          data,
        );
      }

      return { data: await response.json(), error: null };
    })
    .catch((error) => {
      return { error, data: null };
    });

  return { data, error };
};
restClient.get = <P extends OpenApiPaths<'get'>>(url: P, options?: Options<'get', P>): Promise<Result<'get', P>> => restClient('get', url, options);
restClient.post = <P extends OpenApiPaths<'post'>>(url: P, options?: Options<'post', P>): Promise<Result<'post', P>> => restClient('post', url, options);
restClient.put = <P extends OpenApiPaths<'put'>>(url: P, options?: Options<'put', P>): Promise<Result<'put', P>> => restClient('put', url, options);
restClient.patch = <P extends OpenApiPaths<'patch'>>(url: P, options?: Options<'patch', P>): Promise<Result<'patch', P>> => restClient('patch', url, options);
restClient.delete = <P extends OpenApiPaths<'delete'>>(url: P, options?: Options<'delete', P>): Promise<Result<'delete', P>> => restClient('delete', url, options);

export { restClient };

