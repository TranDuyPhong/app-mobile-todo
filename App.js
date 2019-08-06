import React, { useContext } from 'react';

import MainScreen from './screens/main.screen.js';

import { MainProvider, MainContext } from './contexts/main.context.js';

function Context () {
    const { todos, add, deleteAll, toggleState, edit, deleteT, search, countNotDoneToDay } = useContext(MainContext);

    return <MainScreen 
                        todos={todos} 
                        add={add} 
                        deleteAll={deleteAll} 
                        toggleState={toggleState}
                        edit={edit}
                        deleteT={deleteT}
                        search={search}
                        countNotDoneToDay={countNotDoneToDay} />
}

class App extends React.Component {
    render() {
        return (
            <MainProvider>
                <Context />
            </MainProvider>
        )
    }
}

export default App;