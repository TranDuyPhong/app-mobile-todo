import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const widthWindow = Dimensions.get('window').width;

import { IsModalAdd } from '../constants';

class Footer extends Component {
    render() {
        const { toggleModalAdd, deleteAllTodo } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    toggleModalAdd(IsModalAdd);
                }} style={styles.addTodo}>
                    <FontAwesome5 color='#fff' solid size={16} name='plus' />
                    <Text style={styles.text}>Add Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteAllTodo} style={styles.deleteAllTodo}>
                    <FontAwesome5 color='#fff' solid size={16} name='trash' />
                    <Text style={styles.text}>Delete All</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: widthWindow,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    addTodo: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#00a8ff',
        marginVertical: 5
    },
    deleteAllTodo: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff7979',
        marginVertical: 5
    },
    text: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 16,
        fontFamily: 'Times New Roman',
        textTransform: 'uppercase',
        marginLeft: 10
    }
});

export default Footer;