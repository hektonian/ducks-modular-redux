import { Generator, File, namedCasex, casex, log } from 'battlecry';

const ROOT_SAGA_FILE = 'rootSaga.js';
const INITIAL_STATE_FILE = 'initialState.js';
const REDUCERS_FILE = 'reducers.js';
const CONFIG_FILE = 'configureStore.js';
const REDUX_PATH = 'src/redux';

export default class DuckGenerator extends Generator {
  config = { 
    init: {
      description: 'Create configureStore.js, initialState.js, reducers.js, and rootSaga.js files and an example saga-duck'
    },
    generate: {
      args: 'name ...actions?',
      description: 'Create or modify saga-duck to add actions'
    }
  };

  getTemplateFile(file) {
    const template = this.template(file);
    const path = `${REDUX_PATH}/${template.filename}`;

    return new File(path);
  }

  get configFile() {
    return this.getTemplateFile(CONFIG_FILE);
  }

  get rootSagaFile() {
    return this.getTemplateFile(ROOT_SAGA_FILE);
  }

  get initialStateFile() {
    return this.getTemplateFile(INITIAL_STATE_FILE);
  }

  get reducersFile() {
    return this.getTemplateFile(REDUCERS_FILE);
  }

  get actions() {
    return (this.args.actions || ['set']).reverse();
  }

  init() {
    const configFile = this.configFile;
    const rootSagaFile = this.rootSagaFile;
    const initialStateFile = this.initialStateFile;
    const reducersFile = this.reducersFile;

    if(configFile.exists) return log.warn(`Modular saga-ducks have already been initiated. Please check the ${configFile.path} file`);
    if(rootSagaFile.exists) return log.warn(`Modular saga-ducks have already been initiated. Please check the ${rootSagaFile.path} file`);
    if(initialStateFile.exists) return log.warn(`Modular saga-ducks have already been initiated. Please check the ${initialStateFile.path} file`);
    if(reducersFile.exists) return log.warn(`Modular saga-ducks have already been initiated. Please check the ${reducersFile.path} file`);

    this.template(CONFIG_FILE).saveAs(configFile.path);
    this.template(ROOT_SAGA_FILE).saveAs(rootSagaFile.path);
    this.template(INITIAL_STATE_FILE).saveAs(initialStateFile.path);
    this.template(REDUCERS_FILE).saveAs(reducersFile.path);

    this.generator('saga-duck').setArgs({name: 'todo'}).play('generate');
  }

  generate() {
    this.addActionsToDuck();
    this.addDuckToInitialState();
    this.addDuckToReducers();
    this.addDuckToRootSaga();
  }

  addActionsToDuck() {
    const template = this.template('_*');
    const path = `${REDUX_PATH}/modules/${template.filename}`;

    let file = new File(path, this.args.name);
    if(!file.exists) file = template;
    
    this.actions.forEach(action => {
      // Actions
      file.after('// Actions', `const __NA_ME__ = '${casex(this.args.name, 'na-me')}/__NA-ME__';`, action);
      
      // Action Creators
      file.after('// Action Creators', [
        namedCasex('export function __naMe__() {', + `${action}_${this.args.name}`),
        '  return { type: __NA_ME__ };',
        '}',
        ''
      ], action);

      // Initial state

      // Reducer
      file.after('switch (action.type) {', [
        '    case __NA_ME__:',
        '      return {',
        '        ...state',
        '      };',
        ''
      ], action);

      // Side effects

      // Watchers
      file.after('// Watchers', [
        'function* watch__NaMe__() {',
        '  while(true) {',
        '    yield take(__NA_ME__);',
        '  }',
        '}',
        ''
      ], action);

      // Root saga
      file.after('yield all([',[
        '      fork(watch__NaMe__),'
      ], action);
    });

    file.saveAs(path, this.args.name);
  }

  addDuckToInitialState() {
    const file = this.initialStateFile;
    if(!file.exists) return null;
    try {
      file.afterLast('import', "import { initialState as __naMe__ } from './modules/__naMe__';", this.args.name);
    } catch(error) {
      file.prepend("import { initialState as __naMe__ } from './modules/__naMe__';", this.args.name);
    }

    file
      .after('export default {', '  __naMe__,', this.args.name)
      .save();
  }

  addDuckToReducers() {
    const file = this.reducersFile;
    if(!file.exists) return null;

    file
      .afterLast('import', "import __naMe__ from './modules/__naMe__';", this.args.name)
      .after('combineReducers({', '  __naMe__,', this.args.name)
      .save();
  }

  addDuckToRootSaga() {
    const file = this.rootSagaFile;
    if(!file.exists) return null;

    file
      .afterLast('import', "import { saga as __naMe__ } from './modules/__naMe__';", this.args.name)
      .after('yield all([', '    fork(__naMe__),', this.args.name)
      .save();
  }
}
