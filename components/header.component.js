import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const widthWindow = Dimensions.get('window').width;

import logo from '../assets/imgs/Logo_Todo_App.png';

class Header extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { countNotDoneToDay, toggleInfoApp, showNotDoneToDay } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleInfoApp} style={styles.headerLeft}>
                    <Icon name='info' color='#00a8ff' size={24} />
                </TouchableOpacity>
                <View style={styles.headerMiddle}>
                    <Image style={styles.logo} source={logo} />
                    <View style={styles.title}>
                        <Text style={styles.titleI}>I</Text>
                        <Text style={styles.titleD}>D</Text>
                        <Text style={styles.titleO}>O</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={showNotDoneToDay} style={styles.headerRight}>
                    <Icon name='list-alt' color='#ff7979' size={24} />
                    <Text style={styles.badge}>{countNotDoneToDay}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: widthWindow,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    headerLeft: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    headerMiddle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    logo: {
        width: 50,
        height: 50
    }, 
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },  
    titleI: {
        fontSize: 24,
        fontFamily: 'Righteous-Regular',
        color: '#00a8ff'
    },  
    titleD: {
        fontSize: 24,
        fontFamily: 'Righteous-Regular',
        color: '#ff7979'
    },  
    titleO: {
        fontSize: 24,
        fontFamily: 'Righteoucs-Regular',
        color: '#00a8ff'
    },  
    headerRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: -1,
        right: -8,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#00a8ff',
        textAlign: 'center'
    }
});

export default Header;