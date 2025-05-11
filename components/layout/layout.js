import NotificationContext from "@/store/notification-context"
import Notification from "../notification/notification"
import Header from "./main-header"
import { useContext } from "react";


export default function Layout(props){
    const ctx=useContext(NotificationContext);
    const value=ctx.notification;
    return(
        <>
        <Header/>
        <main>
            {props.children}
        </main>
       { value && <Notification title={value.title} message={value.message} status={value.status}/>}
        </>
    )
}