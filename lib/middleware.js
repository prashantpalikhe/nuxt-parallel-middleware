import Middleware from './middleware';
import { getMatchedComponents, promisify } from './utils';

const deepFlatten = arr =>
  [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

Middleware['parallel-middleware'] = async function parallelMiddleware(context) {
  const { route } = context;

  const routeComponents = getMatchedComponents(route);

  // Get all parallelMiddlewares defined in route components
  const parallelMiddlewares = routeComponents.flatMap(
    component => component.options.parallelMiddleware || [],
  );

  if (parallelMiddlewares.length <= 0) {
    return;
  }

  const allMiddlewares = deepFlatten(parallelMiddlewares);

  let unknownMiddlewareFound = false;

  // Make sure all the middleware names are valid
  allMiddlewares.forEach(middleware => {
    if (
      typeof middleware !== 'function' &&
      typeof Middleware[middleware] !== 'function'
    ) {
      unknownMiddlewareFound = true;
      context.error({
        statusCode: 500,
        message: `Unknown middleware: ${middleware}`,
      });
    }
  });

  if (unknownMiddlewareFound) return; // bail out early if unknown middleware found

  // Load batches sequentially, but middlewares within each batch simultaneously
  for (const batch of parallelMiddlewares) {
    const batchMiddlewarePromises = batch.map(midd => {
      const middleware = typeof midd === 'function' ? midd : Middleware[midd];

      return promisify(middleware, context);
    });

    await Promise.all(batchMiddlewarePromises);
  }
};
