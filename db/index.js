import Realm from 'realm';

const TODO_SCHEMA = 'Todo';

const TodoSchema = {
    name: TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: {
            type: 'string',
            default: ''
        },
        state: {
            type: 'bool',
            default: false
        },
        setTime: {
            type: 'string',
            default: null
        },
        setAlarm: {
            type: 'string',
            default: null
        }
    }
};

const databaseOptions = {
    path: 'todolist.realm',
    schema: [TodoSchema],
    schemaVersion: 0
};

export const deleteT = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let todoDelete = realm.objectForPrimaryKey(TODO_SCHEMA, id);
            realm.delete(todoDelete);
            resolve(todoDelete);
        });
    }).catch(error => reject(error));
});

export const deleteAll = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let todos = realm.objects(TODO_SCHEMA);
            realm.delete(todos);
            resolve();
        });
    }).catch(error => reject(error));
});

export const insert = todo => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let todoInsert = realm.create(TODO_SCHEMA, todo);
            resolve(todoInsert);
        });
    }).catch(error => reject(error));
});

export const update = todo => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let todoUpdate = realm.objectForPrimaryKey(TODO_SCHEMA, todo.id);
            todoUpdate.name = todo.name;
            todoUpdate.setAlarm = todo.setAlarm;
            todoUpdate.state = todo.state;
            resolve(todoUpdate);
        });
    }).catch(error => reject(error));
});

export const query = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let todos = realm.objects(TODO_SCHEMA);
        resolve(Array.from(todos));
    }).catch(error => reject(error));
});

export default new Realm(databaseOptions);