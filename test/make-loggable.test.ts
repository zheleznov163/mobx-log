import { autorun, makeAutoObservable } from 'mobx';
import { DefaultLogger } from '../src';
import { configureMakeLoggable, makeLoggable } from '../src';
import { CollectingLogWriter } from '../src/log-writer';

const collectingWriter = new CollectingLogWriter();

configureMakeLoggable({
  logger: new DefaultLogger(collectingWriter),
});

class StoreWithComputed {
  value = 0;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  increment() {
    this.value++;
  }

  get isDividedBy3() {
    return this.value % 3 === 0;
  }
}

class StoreOnlyObservables {
  age?: number;
  name?: string;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  init() {
    this.age = 24;
    this.name = 'Test';
  }
}

class StoreWithoutLog {
  counter = 1;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.counter++;
  }

  get isEven() {
    return this.counter % 2 === 0;
  }
}

type Todo = { id: number; text: string; isDone: boolean }

class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  addTodo(id: number, text: string) {
    this.todos.push({
      id,
      text,
      isDone: false,
    })
  }

  markAsDone(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new Error('Find error');
    }
    todo.isDone = true;
  }
}

describe('makeLoggable', () => {
  beforeEach(() => {
    collectingWriter.clear();
  })

  it('logs', () => {
    const storeWithComputed = new StoreWithComputed();
    const storeOnlyObservables = new StoreOnlyObservables();
    const storeWithoutLog = new StoreWithoutLog();

    let isDividedBy3 = false;
    let isEven = false;
    autorun(() => {
      isDividedBy3 = storeWithComputed.isDividedBy3;
      isEven = storeWithoutLog.isEven;
    });

    storeWithoutLog.increment();
    storeWithComputed.increment();
    storeOnlyObservables.init();
    expect(isDividedBy3).toBeFalsy();
    expect(isEven).toBeTruthy();
    expect(storeWithComputed.value).toBe(1);
    expect(collectingWriter.history).toMatchSnapshot();

    storeWithComputed.increment();
    storeWithComputed.increment();

    expect(collectingWriter.history).toMatchSnapshot();
  });

  it('logs array changes correctly', () => {
    const todoStore = new TodoStore();
    todoStore.addTodo(1, 'Play balalaika');

    expect(collectingWriter.history).toMatchSnapshot();

    todoStore.markAsDone(1);

    expect(collectingWriter.history).toMatchSnapshot();
  })
});
