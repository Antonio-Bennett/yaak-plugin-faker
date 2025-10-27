import {faker} from '@faker-js/faker';
import {PluginDefinition} from '@yaakapp/api';

const modules = Object.keys(faker).filter(key => !key.startsWith('_') && !['definitions', 'rawDefinitions'].includes(key));

export const plugin: PluginDefinition = {
  templateFunctions: modules.flatMap(name => {
    // @ts-ignore
    const module = faker[name];
    return Object.keys(module).filter(n => n !== 'faker').map(functionName => ({
      name: ['faker', name, functionName].join('.'),
      args: [],
      async onRender(_ctx, _args) {
        const fakerFunction = module[functionName];
        const result = fakerFunction();
        if (typeof result !== 'string') {
          return JSON.stringify(result);
        }
        return result;
      },
    }));
  }),
};
