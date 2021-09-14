import { SpyListener } from './spy-listener';
import { config } from './config';

let spyListener: SpyListener;

export const makeLoggable = (store: Object) => {
  if (!spyListener) {
    spyListener = new SpyListener(config.logger);
    spyListener.listen();
  }
  spyListener.addFilterByClass(store.constructor.name);
};
