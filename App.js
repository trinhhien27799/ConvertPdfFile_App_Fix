import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, Platform, Linking } from "react-native";
import tailwind from "twrnc";
import DocumentPicker from 'react-native-document-picker';
import { DocumentDirectoryPath, ExternalDirectoryPath, copyFile, downloadFile, mkdir, writeFile } from 'react-native-fs'
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import { Dialog, Portal, Provider } from "react-native-paper";
import ImageTypeFile from "./Conponents/ImageTypeFile";
import LottieView from "lottie-react-native";

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTypeFile, setSelectedTypeFile] = useState(null);

    const ipConfig = '192.168.1.63';

    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);

    const [currentFilePath, setCurrentFilePath] = useState('');
    const [currentTypeFile, setCurrentTypeFile] = useState('');

    const [loading, setLoading] = useState(false);

    const pickPDF = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            // Handle the selected PDF file here
            setSelectedFile(res[0]);
        } catch (err) {
            // Handle any errors that occur during file selection
            console.log('Error:', err);
        }
    };

    useEffect(() => {
        const DownloadFile = async (fileData) => {
            const dataArr = fileData;
            console.log(dataArr);

            let response = null;

            for (const value of dataArr) {
                console.log("Active Downloading")
                try {
                    const dirs = RNFetchBlob.fs.dirs;
                    response = await RNFetchBlob.config({
                        fileCache: true,
                        appendExt: value.FileExt,
                        path: dirs.DownloadDir + '/' + value.FileName, // Change the file extension based on the file type
                    }).fetch('GET', value.Url);

                    // // Get the file path of the downloaded file
                    const filePath = response.path();
                    console.log(filePath);

                    // Show a notification or alert that the file has been downloaded successfully
                    setCurrentFilePath(filePath);
                    setCurrentTypeFile(value.FileExt);
                    setVisible(true);
                    setSelectedFile(null);
                    setSelectedTypeFile(null);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            }
        }

        console.log("file data: " + selectedFile);
        console.log("type file: " + selectedTypeFile);

        // permission();

        if (selectedFile != null && selectedTypeFile != null) {
            setLoading(true);
            console.log("access download");
            try {
                const formData = new FormData();
                formData.append('pdfFile', {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.type,
                });

                const response = async () => {
                    try {
                        await fetch(`http://${ipConfig}:3000/api/example/${selectedTypeFile}`, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        }).then((dataRes) => { return dataRes.json() }).then((json) => DownloadFile(json));


                    } catch (error) {
                        console.log(error);
                    }
                };

                response();
            } catch (error) {
                // Handle any errors that occurred during the API request
                console.log('API error:', error);
            }
        }
    }, [selectedFile, selectedTypeFile]);

    const SetButtonFunction = (status, fileSelected) => {
        if (fileSelected == null) {
            alert("Bạn chưa chọn file PDF nào");
        }
        else {
            switch (status) {
                case 1:
                    setSelectedTypeFile('word')
                    break;

                case 2:
                    setSelectedTypeFile('powerpoint');
                    break;

                case 3:
                    setSelectedTypeFile('image');
                    break;
            }
        }
    }

    const openDownloadedFile = async () => {
        // const dirs = RNFetchBlob.fs.dirs;
        // const downloadedPath = dirs.DownloadDir;

        try {
            await mkdir(currentFilePath);
            await Linking.openURL(currentFilePath);
        } catch (error) {
            console.error('Error opening download folder:', error);
        }
    }

    return (
        <Provider>
            <View style={tailwind`justify-center flex-1`}>
                <TouchableOpacity
                    style={tailwind`border border-slate-300 rounded-lg w-70 self-center p-4`}
                    onPress={pickPDF}
                >
                    {selectedFile == null
                        ?
                        <Text style={tailwind`self-center text-black`}>
                            Gửi file PDF tại đây
                        </Text>
                        :
                        <View style={tailwind`flex-row items-center self-center`}>
                            <Image
                                style={tailwind`w-10 h-10 mr-2`}
                                source={require('./img/pdf_2497547.png')}
                            />
                            <Text style={tailwind`w-55`}>{selectedFile.name}</Text>
                        </View>
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { setSelectedFile(null); setSelectedTypeFile(null) }}
                    style={tailwind`self-center mt-3`}
                >
                    <Text style={tailwind`text-blue-500`}>Bỏ chọn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tailwind`bg-blue-400 rounded-lg w-60 self-center p-4 mt-20 shadow-md`}
                    onPress={() => { SetButtonFunction(1, selectedFile) }}
                >
                    <View style={tailwind`self-center flex-row items-center`}>
                        <Text style={tailwind`text-white mr-3 font-bold`}>Xuất ra file word</Text>
                        <Image
                            style={tailwind`w-10 h-10`}
                            source={require('./img/word_888883.png')}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tailwind`bg-orange-700 rounded-lg w-60 self-center p-4 mt-5 shadow-md`}
                    onPress={() => { SetButtonFunction(2, selectedFile) }}
                >
                    <View style={tailwind`self-center flex-row items-center`}>
                        <Text style={tailwind`text-white mr-3 font-bold`}>Xuất ra file pptx</Text>
                        <Image
                            style={tailwind`w-10 h-10`}
                            source={require('./img/powerpoint_888874.png')}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tailwind`bg-green-700 rounded-lg w-60 self-center p-4 mt-5 shadow-md`}
                    onPress={() => SetButtonFunction(3, selectedFile)}
                >
                    <View style={tailwind`self-center flex-row items-center`}>
                        <Text style={tailwind`text-white mr-3 font-bold`}>Xuất ra file ảnh</Text>
                        <Image
                            style={tailwind`w-10 h-10`}
                            source={require('./img/image_1829586.png')}
                        />
                    </View>
                </TouchableOpacity>
                {loading
                    ? <View style={tailwind`absolute bg-slate-500 bg-opacity-30 self-center w-full h-full justify-center`}>
                        <LottieView source={require('./LoadingAnimation.json')} style={tailwind`w-50 h-50 self-center`} autoPlay loop />
                    </View>
                    : <></>
                }
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        <Text>Thông Báo</Text>
                    </Dialog.Title>
                    <Dialog.Content>
                        <View>
                            {/* Content Complete */}
                            <Text style={tailwind`mb-3`}>Tải về thành công:</Text>

                            {/* File Detail */}
                            <View style={tailwind`flex-row`}>
                                <ImageTypeFile typeFile={currentTypeFile} />
                                <Text style={tailwind`ml-3 w-70`}>{currentFilePath}</Text>
                            </View>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <TouchableOpacity onPress={hideDialog} style={tailwind`mr-4`}>
                            <Text style={tailwind`text-base`}>OK</Text>
                        </TouchableOpacity>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Provider>
    )
}

export default App