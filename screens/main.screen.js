import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    Image
} from 'react-native';

import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from "react-native-modal-datetime-picker";
import ReactNativeAN from 'react-native-alarm-notification';

import HeaderComponent from '../components/header.component.js';
import TodoItemComponent from '../components/todoItem.component.js';
import FooterComponent from '../components/footer.component.js';

import { IsModalAdd, IsModalEdit, IsModalSetAlarm } from '../constants';

import { formatDate } from '../services/index.js';

import author from '../assets/imgs/author.png';

class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            [IsModalAdd]: false,
            [IsModalEdit]: false,
            [IsModalSetAlarm]: false,
            idTodoEdit: null,
            nameTodoEdit: null,
            isModalDatetime: false,
            date: null,
            todos: [],
            render: false,
            toggleStatusState: null,
            filterDate: new Date(),
            isInfoApp: false
        }
        this.input = React.createRef();
        this.flatList = React.createRef();
        const { search } = this.props;
        this.search = search;
        this.keyword = React.createRef();
        this.date = React.createRef();
    }

    toggleModal = (modal, id = null, name = null, setAlarm = null) => {
        this.setState(prev => {
            return {
                ...prev,
                [modal]: !prev[modal],
                idTodoEdit: id,
                nameTodoEdit: name,
                date: null,
                date: setAlarm
            }
        });
    }

    addTodoCustom = (name, date, callBackContext) => {
        if (!name) {
            Alert.alert('Add todo', 'Name is required');
            return;
        }
        callBackContext(name, date);
        ToastAndroid.show(`Add todo item ${name.toUpperCase()} successfully`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        if (this.flatList.current) {
            let scrollToEndFlatView = setTimeout(() => {
                this.flatList.current.scrollToEnd();
            }, 100, () => {
                clearTimeout(scrollToEndFlatView);
            });
        }
        this.toggleModal(IsModalAdd);
        this.input.current._lastNativeText = '';
        this.setState(prev => {
            return {
                ...prev,
                date: null
            }
        });
    }

    deleteAllTodoCustom = callBackContext => {
        Alert.alert(
            'Delete all todo ?', 
            'You sure want to delete all todo ?', 
            [
                {
                    text: 'Ok', onPress: () => callBackContext()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            {
                cancelable: false
            });
    }
    
    editTodoCustom = (id, name, setAlarm, callBackContext) => {
        if (!id) {
            Alert.alert('Edit todo item', 'No todo item choosen');
        } else {
            callBackContext(id, name, setAlarm);
            ToastAndroid.show(`Edit todo item ${this.state.nameTodoEdit} to ${name} successfully`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
        this.setState(prev => {
            return {
                ...prev,
                date: null,
                idTodoEdit: null,
                nameTodoEdit: null
            }
        });
        this.toggleModal(IsModalEdit);
        this.input.current._lastNativeText = '';
    }

    deleteTodoCustom = (id, name, deleteT) => {
        if (!id) {
            Alert.alert('Delete todo item', 'No todo item chossen');
            return;
        }
        Alert.alert(
            `Delete todo item ${name} ?`, 
            `You sure want to delete todo item ${name} ?`, 
            [
                {
                    text: 'Ok', onPress: () => {
                        deleteT(id);
                        ToastAndroid.show(`Delete todo item ${name} successfully`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            {
                cancelable: false
            });
    }

    toggleModalDateTime = () => {
        this.setState(prev => {
            return {
                ...prev,
                isModalDatetime: !prev.isModalDatetime
            }
        });
    }

    async componentDidMount() {
        // let todos = await this.search(this.keyword.current._lastNativeText, this.state.toggleStatusState, this.state.filterDate);
        // this.setState(prev => {
        //     return {
        //         ...prev,
        //         todos
        //     }
        // });
    }

    async componentDidUpdate() {
        if (this.state.render) {
            let todos = await this.search(this.keyword.current._lastNativeText, this.state.toggleStatusState, this.state.filterDate);
            this.setState(prev => {
                return {
                    ...prev,
                    todos,
                    render: false
                }
            });
        }
    }

    componentWillReceiveProps() {
        this.setState(prev => {
            return {
                ...prev,
                render: true
            }
        });
    }
    
    seacrhTodo = async (keyword, state, date, callBackContext) => {
        let todos = await callBackContext(keyword, state, date);
        this.setState(prev => {
            return {
                ...prev,
                todos
            }
        });
    }

    toogleStatusState = async (keyword, state, date, callBackContext) => {
        switch (state) {
            case null:
                state = false;
                break;
            case false:
                state = true;
                break;
            case true:
                state = null;
                break;
        }
        let todos = await callBackContext(keyword, state, date);
        this.setState(prev => {
            return {
                ...prev,
                toggleStatusState: state,
                todos
            }
        });
    }

    filterDate = async (keyword, state, date, callBackContext) => { 
        let todos = await callBackContext(keyword, state, date);
        this.setState(prev => {
            return {
                ...prev,
                filterDate: date,
                todos
            }
        });
    }

    toggleInfoApp = () => {
        this.setState(prev => {
            return {
                ...prev,
                isInfoApp: !prev.isInfoApp
            }
        });
    }

    showNotDoneToDay = async () => {
        let date = new Date();
        let todos = await this.search('', false, date);
        this.setState(prev => {
            return {
                ...prev,
                toggleStatusState: false,
                filterDate: date,
                todos
            }
        });
    };

    render() {
        const { isModalAdd, isModalEdit, isModalSetAlarm, todos, toggleStatusState, isInfoApp } = this.state;
        const { add, deleteAll, toggleState, edit, deleteT, countNotDoneToDay } = this.props;

        let classState = styles.isNullRunCheckBox;
        if (toggleStatusState !== null) {
            classState = toggleStatusState ? styles.isRunCheckBox : styles.isNotRunCheckBox;
        }

        let classCheckBox = styles.isNullCheckBox;
        if (toggleStatusState !== null) {
            classCheckBox = !toggleStatusState ? styles.isCheckBox : styles.isNotCheckBox;
        }

        const count = countNotDoneToDay();

        // const d = '06-08-2019 09:13:00';

        // const alarmNotificationData = {
        //     id: '123',
        //     title: 'Cooking',
        //     message: 'Hello. Cooking for today',
        //     channel: '12345',
        //     ticker: 'No pain No gain',
        //     auto_cancel: true,
        //     vibrate: true,
        //     vibration: 100,  
        //     small_icon: "ic_launcher",               
        //     large_icon: "ic_launcher",
        //     play_sound: true,
        //     sound_name: 'my_sound',                            
        //     color: "red",
        //     schedule_once: true,          
        //     tag: 'some_tag',
        //     fire_date: d,  
        //     data: {
        //         id: '123'
        //     }
        // }

        //ReactNativeAN.scheduleAlarm(alarmNotificationData);

        return (
            <View style={styles.container}>
                {/* <TouchableOpacity onPress={
                   () => {
                    ReactNativeAN.sendNotification(alarmNotificationData);
                   }
                }>
                    <Text>sendNotification</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                    () => {
                        ReactNativeAN.stopAlarm()
                    }
                }>
                    <Text>stopAlarm</Text>
                </TouchableOpacity> */}

                <Modal isVisible={isInfoApp} backdropOpacity={0.9}>
                    <View style={{flex: 1, padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: 100, height: 100}} source={author} />
                        <Text style={{color: 'rgba(255, 255, 255, 1)', fontSize: 24, fontFamily: 'Righteous-Regular', marginTop: 10}}>Trần Duy Phong</Text>
                        <Text style={{color: 'rgba(255, 255, 255, 1)', fontSize: 16, fontFamily: 'Righteous-Regular',}}>( PhongSn )</Text>
                        <Text style={{color: 'rgba(255, 255, 255, 1)', fontSize: 14, fontFamily: 'Righteous-Regular', position: 'absolute', bottom: 0}}>Designed by PhongSn @2019.</Text>
                        <TouchableOpacity style={{position: 'absolute', right: 0, top: 0, width: 36, height: 36, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={this.toggleInfoApp}>
                            <FontAwesome5 color='#000' size={24} solid name='times' />
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal isVisible={isModalAdd} backdropOpacity={0.9}>
                    <View style={styles.modal}>
                        <Text style={styles.textTitle}>
                            Add Todo
                        </Text>
                        <Text style={styles.label}>Todo name</Text>
                        <TextInput ref={this.input} style={styles.input} />
                        <Text style={styles.label}>Set time alarm</Text>
                        <TouchableOpacity onPress={
                            () => {
                                this.toggleModalDateTime();
                            }
                        } style={styles.selectDate}>
                            <Text style={styles.textSelectDate}>{
                                this.state.date || 'Select datetime'
                            }</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            mode='datetime'
                            isVisible={this.state.isModalDatetime}
                            onConfirm={(date) => {
                                this.setState(prev => {
                                    return {
                                        ...prev,
                                        date: formatDate(date)
                                    }
                                });
                                this.toggleModalDateTime();
                            }}
                            onCancel={() => {
                                this.setState(prev => {
                                    return {
                                        ...prev,
                                        date: null
                                    }
                                });
                                this.toggleModalDateTime();
                            }}
                            />
                        <TouchableOpacity onPress={() => {
                            this.addTodoCustom(this.input.current._lastNativeText, this.state.date, add);
                        }} style={styles.accept}>
                            <FontAwesome5 color='#fff' solid size={16} name='check' />
                            <Text style={styles.text}>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.toggleModal(IsModalAdd);
                        }} style={styles.cancel}>
                            <FontAwesome5 color='#fff' solid size={16} name='minus' />
                            <Text style={styles.text}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal isVisible={isModalEdit} backdropOpacity={0.9}>
                    <View style={styles.modal}>
                        <Text style={styles.textTitle}>
                            Edit todo: {
                                this.state.nameTodoEdit || 'Empty'
                            }
                        </Text>
                        <Text style={styles.label}>Todo name</Text>
                        <TextInput value={
                                this.state.nameTodoEdit || 'Empty'
                            } ref={this.input} style={styles.input} />
                        <Text style={styles.label}>Set time alarm</Text>
                        <TouchableOpacity onPress={
                            () => {
                                this.toggleModalDateTime();
                            }
                        } style={styles.selectDate}>
                            <Text style={styles.textSelectDate}>{
                                this.state.date || 'Select datetime'
                            }</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            mode='datetime'
                            isVisible={this.state.isModalDatetime}
                            onConfirm={(date) => {
                                this.setState(prev => {
                                    return {
                                        ...prev,
                                        date: formatDate(date)
                                    }
                                });
                                this.toggleModalDateTime();
                            }}
                            onCancel={() => {
                                this.setState(prev => {
                                    return {
                                        ...prev,
                                        date: null
                                    }
                                });
                                this.toggleModalDateTime();
                            }}
                            />
                        <TouchableOpacity onPress={() => {
                            this.editTodoCustom(this.state.idTodoEdit, this.input.current._lastNativeText, this.state.date, edit);
                        }} style={styles.accept}>
                            <FontAwesome5 color='#fff' solid size={16} name='check' />
                            <Text style={styles.text}>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.toggleModal(IsModalEdit);
                        }} style={styles.cancel}>
                            <FontAwesome5 color='#fff' solid size={16} name='minus' />
                            <Text style={styles.text}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal isVisible={isModalSetAlarm} backdropOpacity={0.9}>
                    <View style={styles.modal}>
                        <Text style={styles.textTitle}>
                            Set Alarm: Cooking
                        </Text>
                        <Text style={styles.label}>Time</Text>
                        <TextInput style={styles.input} />
                        <TouchableOpacity style={styles.accept}>
                            <FontAwesome5 color='#fff' solid size={16} name='check' />
                            <Text style={styles.text}>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.toggleModal(IsModalSetAlarm);
                        }} style={styles.cancel}>
                            <FontAwesome5 color='#fff' solid size={16} name='minus' />
                            <Text style={styles.text}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <HeaderComponent showNotDoneToDay={this.showNotDoneToDay} toggleInfoApp={this.toggleInfoApp} countNotDoneToDay={count} />
                <View style={styles.filter}>
                    <Text style={styles.textSearch}>Search</Text>
                    <TextInput ref={this.keyword} onChangeText={
                        text => {
                            this.seacrhTodo(text, this.state.toggleStatusState, this.state.filterDate, this.search);
                        }
                    } style={styles.search} />
                    <Text style={styles.textSearch}>Not Done / Done / All</Text>
                    <TouchableOpacity onPress={() => {
                        this.toogleStatusState(this.keyword.current._lastNativeText, this.state.toggleStatusState, this.state.filterDate, this.search)
                    }} style={[styles.checkBox, { ...classCheckBox }]}>
                        <View style={[styles.runCheckBox, { ...classState }]}></View>
                    </TouchableOpacity>
                    <DatePicker
                        ref={this.date}
                        style={styles.date}
                        date={this.state.filterDate}
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        minDate="1999-01-01"
                        maxDate="9999-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        }}
                        onDateChange={(date) => {
                            this.filterDate(this.keyword.current._lastNativeText, this.state.toggleStatusState, new Date(date), this.search);
                        }}
                    />
                </View>
                <View style={styles.main}>
                    {
                        todos.length ? 
                        (
                            <FlatList ref={this.flatList} data={todos} contentContainerStyle={styles.mainContent} renderItem={
                                ({item}) => (
                                    <TodoItemComponent deleteTodo={() => {
                                        this.deleteTodoCustom(item.id, item.name, deleteT)
                                    }} toggleModal={this.toggleModal} toggleState={toggleState} key={item.id} {...item} />
                                )
                            } keyExtractor={item => item.id.toString()} />
                        ) : 
                        (
                            <View style={styles.wrapNoItemTodo}>
                                <Text style={styles.noItemTodo}>No have item todo !!!</Text>
                            </View>
                        )
                    }
                </View>
                <FooterComponent deleteAllTodo={() => {
                    this.deleteAllTodoCustom(deleteAll);
                }} toggleModalAdd={this.toggleModal} />
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    filter: {
        width: '100%',
        padding: 10
    },
    textSearch: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Times New Roman',
        fontSize: 16,
        marginBottom: 5
    },  
    search: {
        marginBottom: 5,
        width: '100%',
        height: 40,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingHorizontal: 10
    },
    checkBox: {
        width: 102,
        height: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 3,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 5
    },  
    runCheckBox: {
        width: 34,
        height: 24,
    },  
    isCheckBox: {
        alignItems: 'flex-start'
    },
    isNotCheckBox: {
        alignItems: 'center'
    },
    isNullCheckBox: {
        alignItems: 'flex-end'
    },
    isRunCheckBox: {
        backgroundColor: '#00a8ff'
    },
    isNotRunCheckBox: {
        backgroundColor: '#ff7979'
    },
    isNullRunCheckBox: {
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },  
    date: {
        width: '100%',
        height: 40
    },  
    selectDate: {
        marginVertical: 10,
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },  
    textSelectDate: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: 'rgba(0, 0, 0, 0.3)'
    },  
    main: {
        flex: 1
    },
    mainContent: {
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    wrapNoItemTodo: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },  
    noItemTodo: {
        fontSize: 20,
        fontFamily: 'Times New Roman',
        color: 'rgba(0, 0, 0, 1)'
    },  
    modal: {
        flex: 1,
        padding: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    textTitle: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 20,
        fontFamily: 'Times New Roman',
        textTransform: 'uppercase',
        marginBottom: 10
    },  
    label: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 16,
        fontFamily: 'Times New Roman'
    },
    input: {
        marginVertical: 10,
        width: '100%',
        height: 40,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingHorizontal: 10
    },
    accept: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00a8ff',
        flexDirection: 'row'
    },
    text: {
        marginLeft: 10,
        fontFamily: 'Times New Roman',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 1)'
    },
    cancel: {
        marginTop: 10,
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff7979',
        flexDirection: 'row'
    }
});

export default Main;