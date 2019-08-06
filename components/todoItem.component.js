import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { IsModalEdit } from '../constants';

import { formatDate } from '../services/index.js';

class TodoItem extends Component {
    render() {
        const { state, name, id, toggleState, toggleModal, deleteTodo, setTime, setAlarm } = this.props;
        const classState = state ? styles.isDone : styles.isNotDone;
        const solid = state ? true : false;
        const checkBox = state ? styles.isCheckBox : styles.isNotCheckBox;
        const runCheckBox = state ? styles.isRunCheckBox : styles.isNotRunCheckBox;
        
        return (
            <View style={[styles.container, { ...classState }]}>
                <View style={styles.content}>
                    <View style={styles.name}>
                        <FontAwesome5 color='#000' solid={solid} size={16} name='circle' />
                        <Text style={styles.nameContent}>{name}</Text>
                    </View>
                    <View style={styles.clock}>
                        <FontAwesome5 color='#000' solid size={16} name='clock' />
                        <Text style={styles.clockContent}>{formatDate(setTime)}</Text>
                    </View>
                    <View style={styles.alarm}>
                        <FontAwesome5 color='#000' solid size={16} name='bell' />
                        <Text style={styles.alarmContent}>{setAlarm ? setAlarm : ''}</Text>
                    </View>
                </View>
                <View style={styles.check}>
                    <TouchableOpacity onPress={() => {
                        toggleState(id);
                    }} style={[styles.checkBox, { ...checkBox }]}>
                        <View style={[styles.runCheckBox, { ...runCheckBox }]}></View>
                    </TouchableOpacity>
                </View>
                <View style={styles.function}>
                    <TouchableOpacity style={{flex: 1}}>
                        <FontAwesome5 color='#000' solid={solid} size={16} name='stopwatch' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        toggleModal(IsModalEdit, id, name, setAlarm);
                    }} style={{flex: 1}}>
                        <FontAwesome5 color='#000' solid={solid} size={16} name='edit' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteTodo} style={{flex: 1}}>
                        <FontAwesome5 color='#000' solid={solid} size={16} name='trash' />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    isDone: {
        backgroundColor: '#00a8ff'
    },
    isNotDone: {
        backgroundColor: '#ff7979'
    },
    content: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start'
    },  
    name: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameContent: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: 'rgba(255, 255, 255, 1)'
    },
    clock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    clockContent: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: 'rgba(255, 255, 255, 1)'
    },
    alarm: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alarmContent: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: 'rgba(255, 255, 255, 1)'
    },
    check: {
        flex: 0.15
    },  
    checkBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 3,
        display: 'flex'
    },  
    isCheckBox: {
        justifyContent: 'flex-start'
    },
    isNotCheckBox: {
        justifyContent: 'flex-end'
    },
    runCheckBox: {
        flex: 0.5
    },  
    isRunCheckBox: {
        backgroundColor: '#00a8ff'
    },
    isNotRunCheckBox: {
        backgroundColor: '#ff7979'
    },
    function: {
        flex: 0.15,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

export default TodoItem;