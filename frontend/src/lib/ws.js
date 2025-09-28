import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
export const WS_URL = `${import.meta?.env?.VITE_API_BASE || ""}/ws`;
export const WS_TOPIC = "/topic/routes";
export function useRoutesStomp(onMessage){
const client = new StompClient({ webSocketFactory: () => new SockJS(WS_URL), onConnect: () => client.subscribe(WS_TOPIC, onMessage), debug: () => {}, reconnectDelay: 3000 });
client.activate();
return () => client.deactivate();
}









