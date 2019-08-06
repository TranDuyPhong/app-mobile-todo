import React, { Component } from 'react';

import shortId from 'shortid';

export const MainContext = React.createContext();

import { formatDate } from '../services/index.js';

import { query, insert, deleteAll as deleteAllFromDb, update, deleteT } from '../db/index.js';

export class MainProvider extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            todos: []
        }
    }

    componentWillMount() {
        query().then(todos => {
            let t = [];
            t = todos.map(todo => {
                return {...todo}
            });;
            this.setState(prev => {
                return {
                    ...prev,
                    todos: t
                }
            });
        }).catch(error => console.log(error));
    }

    add = (name, setAlarm) => {
        alert(setAlarm);
        let todos = [];
        Object.assign(todos, this.state.todos);
        let todo = {
            id: shortId.generate(),
            name,
            state: false,
            setTime: new Date().toString(),
            setAlarm
        }
        todos.push(todo);
        insert(todo).then().catch();
        this.setState(prev => {
            return {
                ...prev,
                todos
            }
        });
    }

    deleteAll = () => {
        deleteAllFromDb().then().catch();
        this.setState(prev => {
            return {
                ...prev,
                todos: []
            }
        });
    }

    toggleState = id => {
        let todos = [];
        Object.assign(todos, this.state.todos);
        let todo = todos.find(p => p.id === id);
        if (todo) {
            todo.state = !todo.state;
            update(todo).then().catch();
            this.setState(prev => {
                return {
                    ...prev,
                    todos
                }
            });
        }
    }

    edit = (id, name, setAlarm) => {
        let todos = [];
        Object.assign(todos, this.state.todos);
        let todo = todos.find(p => p.id === id);
        if (todo) {
            todo.name = name;
            todo.setAlarm = setAlarm;
            update(todo).then().catch();
            this.setState(prev => {
                return {
                    ...prev,
                    todos
                }
            });
        }
    }

    deleteT = id => {
        let todos = [];
        Object.assign(todos, this.state.todos);
        todos = todos.filter(p => p.id !== id);
        deleteT(id).then().catch();
        this.setState(prev => {
            return {
                ...prev,
                todos
            }
        });
    }

    countNotDoneToDay = () => {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let count = this.state.todos.filter(p => {
            let setTime = new Date(p.setTime);
            setTime.setHours(0, 0, 0, 0);
            return setTime.getTime() === currentDate.getTime() && !p.state;
        }).length;
        return count;
    }

    search = async (keyword, state, date)=> {
        let todos = [];
        Object.assign(todos, this.state.todos);
        if (keyword && keyword !== '') {
            todos = await todos.filter(p => p.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || p.name.toLowerCase().lastIndexOf(keyword.toLowerCase()) !== -1);
        }
        if (state === true || state === false) {
            todos = await todos.filter(p => p.state === state);
        }
        if (date) {
            date.setHours(0, 0, 0, 0);
            todos = await todos.filter(p => {
                let setTime = new Date(p.setTime);
                setTime.setHours(0, 0, 0, 0);
                return setTime.getTime() === date.getTime();
            });
        }
        return todos;
    }

    render() {
        return (
            <MainContext.Provider value={{
                todos: this.state.todos,
                add: this.add,
                deleteAll: this.deleteAll,
                toggleState: this.toggleState,
                edit: this.edit,
                deleteT: this.deleteT,
                search: this.search,
                countNotDoneToDay: this.countNotDoneToDay
            }}>
                {this.props.children}
            </MainContext.Provider>
        );
    }
}