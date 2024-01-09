import React from 'react'
import { Image, View } from 'react-native'
import tailwind from 'twrnc'

const ImageTypeFile = ({ typeFile }) => {
    switch (typeFile) {
        case 'docx':
            return (
                <View>
                    <Image source={require('../img/word_888883.png')} style={tailwind`w-10 h-10`} />
                </View>
            )
            break;

        case 'pptx':
            return (
                <View>
                    <Image source={require('../img/powerpoint_888874.png')} style={tailwind`w-10 h-10`} />
                </View>
            )
            break;

        case 'png':
            return (
                <View>
                    <Image source={require('../img/image_1829586.png')} style={tailwind`w-10 h-10`} />
                </View>
            )
            break;

        default:
            break;
    }
}

export default ImageTypeFile