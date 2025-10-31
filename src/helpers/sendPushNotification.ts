import axios from "axios";


type notificationProps = {
    expoPushToken: string;
    title: string;
    body: string;
}



export const sendPushNotification = async({expoPushToken, title, body}: notificationProps) =>{
    
    await axios.post("https://exp.host/--/api/v2/push/send",{
        to: expoPushToken,
        sound: "default",
        title,
        body
    })
}
